import { validateMessage, SENDER, EXT_NAME, MSG_TYPE, POPUP_WINDOW_NAME } from "../scripts/message";
import { RPC_CALL } from '../apis/message';
import qs from 'qs';

import {
    initAccountUpdate,
    addAccountUpdate,
    changeAccountUpdate,
    editAccountNameUpdate,
    connectAccountUpdate,

    newRecipientUpdate,
    networkStateUpdate,
    disconnectUpdate,

    restoreState,

    getCurrentAccounts,
    getWalletPwd,

    setWalletPwdUpdate,

    checkSubmitParams
} from '../scripts/state'

/**
 * Connections between Content Script and Background
 */
const contentConnections = {} // cid => connection
const hashToConnections = {} // hash => cid
const appToConnections = {} // app => cid

browser.runtime.onInstalled.addListener(function () {
    console.log("CallMask extension installed" + new Date())

    restoreState();
});

/**
 * Listen message from content-script and do response
 */
browser.runtime.onConnect.addListener((connection) => {
    if (connection.name.indexOf("backgroundConnection") !== 0) return;
    if (connection.name.indexOf("-") === -1) return;

    const cid = connection.name.substring(connection.name.indexOf("-")+1)

    contentConnections[cid] = connection;

    // ############ MSG_A #4
    connection.onMessage.addListener(async (msg, port) => {
        if (!validateMessage(msg, {sender: SENDER.CONTENT})) return;

        await handleApiCalls(msg, port);
    });

    connection.onDisconnect.addListener(() => {
        delete contentConnections[cid];
    });
});

/**
 * Open Popup from background for user interactive confirmation
 * @param {*} msg 
 */
const openPopup = async (msg) => {
    // save app connections
    appToConnections[msg.data.app] = msg.cid;

    // open popup ui
    const width = Number(msg.data.width);
    msg.sender = SENDER.BACKGROUND;
    const querystr = qs.stringify(msg);
    const specs = "width=380,height=630,status=no,scrollbars=yes,resizable=no,location=no,menubar=no,left=" + (width-380);
    const _window = chrome.window.getCurrent();
    _window.open("popup.html?" + querystr, POPUP_WINDOW_NAME, specs);
}

/**
 * Process API request from content script
 * 
 * @param {*} msg 
 * @param {*} port 
 */
// ############ MSG_A #5
const handleApiCalls = async (msg, port) => {
    const app = msg.data.app;

    let ret = undefined;
    let result = undefined;

    switch (msg.type) {
        case MSG_TYPE.DISCONNECT:
            disconnectUpdate(app);
            break;
        case MSG_TYPE.CONNECT:
        case MSG_TYPE.CURRENT_ACCOUNTS:
            ret = getCurrentAccounts(app);
            if (ret.length > 0) {
                result = {
                    id: msg.id,
                    ext: EXT_NAME,
                    sender: SENDER.BACKGROUND,
                    type: `${msg.type}_result`,
                    res: ret
                };
                // ############ MSG_A #6.1
                port.postMessage(result)
            } else {
                // ############ MSG_A #6.2
                await openPopup(msg);
            }
            break;
        case MSG_TYPE.SIGN:
            await openPopup(msg);
            break;
        case MSG_TYPE.SUBMIT:
            ret = checkSubmitParams(msg.data)
            if (ret) {
                result = {
                    id: msg.id,
                    ext: EXT_NAME,
                    sender: SENDER.BACKGROUND,
                    type: `${msg.type}_result`,
                    message: ret,
                    res: null
                };
                // ############ MSG_A #6.1
                port.postMessage(result)
            } else {
                await openPopup(msg);
            }
            break;
    }
}

/**
 * Forward message to all content script connections
 * @param {*} type 
 * @param {*} res 
 */
const forwardToAll = (type, res) => {
    const forward_msg = {
        id: 0,
        ext: EXT_NAME,
        sender: SENDER.BACKGROUND,
        type: type,
        res: res
    };

    for (let cid in contentConnections) {
        const conn = contentConnections[cid];
        if (conn) {
            // ############ MSG_C #3
            conn.postMessage(forward_msg);
        }
    }
}

const forwardResult = (tx) => {
    const forward_msg = {
        id: 0,
        ext: EXT_NAME,
        sender: SENDER.BACKGROUND,
        type: MSG_TYPE.TX_RESULT,
        res: tx
    };
    const cid = hashToConnections[tx.id];
    if (cid) {
        delete hashToConnections[tx.id];
        const conn = contentConnections[cid];
        if (conn) {
            conn.postMessage(forward_msg);
        }
    }
}

const forwardToApp = (type, info) => {
    const forward_msg = {
        id: 0,
        ext: EXT_NAME,
        sender: SENDER.BACKGROUND,
        type: type,
        res: info.accountList
    };
    const cid = appToConnections[info.app];
    if (cid) {
        const conn = contentConnections[cid];
        if (conn) {
            conn.postMessage(forward_msg);
        }
    }
}

/**
 * Handle popup RPC call for state change
 * 
 * @param {*} msg 
 * @returns 
 */
const handleUiApiCalls = async (msg) => {
    let result = null;

    switch (msg.msg_type) {
        case RPC_CALL.INIT_ACCOUNT:
            result = initAccountUpdate(msg.data);
            break;
        case RPC_CALL.ADD_ACCCOUNT:
            result = addAccountUpdate(msg.data);
            break;
        case RPC_CALL.CHANGE_ACCOUNT:
            result = changeAccountUpdate(msg.data);
            break;
        case RPC_CALL.CONNECT_ACCOUNT:
            result = connectAccountUpdate(msg.data);
            // forward to content-script -> inpage
            if (result.changed) {
                forwardToApp(MSG_TYPE.ACCOUNT_CHANGED, {
                    app: msg.data.app,
                    accountList: result.list
                });
            }            
            break;
        case RPC_CALL.EDIT_ACCOUNT_NAME:
            result = editAccountNameUpdate(msg.data);
            break;
        case RPC_CALL.NEW_RECIPIENT:
            result = newRecipientUpdate(msg.data);
            break;
        case RPC_CALL.NETWORK_STATE:
            result = networkStateUpdate(msg.data);
            // forward to content-script -> inpage
            forwardToAll(MSG_TYPE.NETWORK_STATE, msg.data);
            break;
        case RPC_CALL.GET_WALLET_PWD:
            result = getWalletPwd(msg.data);
            break;
        case RPC_CALL.SET_WALLET_PWD:
            result = setWalletPwdUpdate(msg.data);
            break;
    }
    return result;
}

/**
 * Connection to popup
 */
let popupConnection = null;
const popupListener = async (res) => {
    // ############ MSG_B #2
    const data = await handleUiApiCalls(res);

    const result = {
        rpcId: res.rpcId,
        msg_type: `${res.msg_type}_response`,
        res: data
    }

    // ############ MSG_B #3
    popupConnection.postMessage(result);
}

/**
 * listen for message from the ui
 * for message
 *  account_changed
 *  transaction_result
 *  new account
 * 
 */
/**
 * Listen message from popup
 * including:
 *  Confirm response from popup, and forward to content script
 *  Init popupConnection with POPUP_INITIALIZED message
 *  Forward messge of state chanage to content-script
 *      ACCOUNT_CHANGED
 *      NETWORK_STATE 
 * 
 */
browser.runtime.onMessage.addListener(async (message) => {
    if (!validateMessage(message, {sender: "popup"})) return;

    /**
     * Got response, and foward to content script
     */
    // ############ MSG_A #8
    if (message.type === MSG_TYPE.POPUP_CONFIRM) {
        const msg = message.res;

        const result = {
            id: msg.id,
            ext: EXT_NAME,
            sender: SENDER.BACKGROUND,
            type: `${msg.type}_result`,
            res: msg.res
        };

        const conn = contentConnections[msg.cid];
        if (conn) {
            // ############ MSG_A #9
            conn.postMessage(result);

            if (msg.type === MSG_TYPE.SUBMIT) {
                if (msg.res.success && msg.res.data) {
                    const hash = msg.res.data;
                    hashToConnections[hash] = msg.cid
                }
            }
        }

        return;
    }

    /**
     * Init popupConnection
     */
    if (message.type === MSG_TYPE.POPUP_INITIALIZED) {
        popupConnection = browser.runtime.connect(browser.runtime.id, {
            name: "popupConnection"
        });
        popupConnection.onMessage.addListener(popupListener);
        return;
    }

    /**
     * Forward message to all content script
     */
    // ############ MSG_C #2
    if (message.type === MSG_TYPE.ACCOUNT_CHANGED
            || message.type == MSG_TYPE.NETWORK_STATE) {

        const forward_msg = message;
        forward_msg.sender = SENDER.BACKGROUND;

        forwardToAll(forward_msg);
        return;
    }

    if (message.type === MSG_TYPE.TX_RESULT) {
        forwardResult(message.res);
        return;
    }
    
});