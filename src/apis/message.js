import { EXT_NAME, MSG_TYPE, SENDER } from "../scripts/message";

/**
 * Send broadcast message to background
 * @param {*} type 
 * @param {*} data 
 */
export const sendMessage = (type, data) => {
    // ############ MSG_C #1
    browser.runtime.sendMessage({
        type: type,
        ext: EXT_NAME,
        res: data,
        message: "",
        sender: SENDER.POPUP
    });
}

/**
 * Send confirm message to background
 * 
 * @param {*} params 
 * @param {*} data 
 */
export const confirmMessage = (params, data) => {
    const res = params;
    res["res"] = data;

    // ############ MSG_A #7
    browser.runtime.sendMessage({
        type: MSG_TYPE.POPUP_CONFIRM,
        ext: EXT_NAME,
        res: res,
        message: "",
        sender: SENDER.POPUP
    });
}

let bgConnection = null;

/**
 * Init connection from background, and save connection
 */
export const initMessage = () => {
    return new Promise((resolve, reject) => {
        browser.runtime.onConnect.addListener((connection) => {
            if (connection.name !== "popupConnection") {
                return reject("Invalid connection " + connection.name);
            }
            bgConnection = connection;
            resolve(true);
        })

        sendMessage(MSG_TYPE.POPUP_INITIALIZED, {});
    });
}

/**
 * RPC CALL from popup to background and response back
 */
let rpcId = 1;
const rpcCALL = (msg_type, data) => {
    return new Promise((resolve, reject) => {
        if (!bgConnection) reject("background not connected");

        const rpcMsg = {rpcId, msg_type, data};
        /**
         * Message from background to this(popup)
         * @param {*} msg 
         * @returns
         */
        const rpcListener = (msg) => {
            // ############ MSG_B #4
            if (msg.msg_type !== `${msg_type}_response`) {
                console.error("Invalid RPC response msg_type", msg.msg_type);
                return;
            }
            if (msg.rpcId !== rpcMsg.rpcId) {
                console.error("Invalid RPC response rpcId", msg.rpcId);
                return;
            }

            bgConnection.onMessage.removeListener(rpcListener);
            resolve(msg.res);
        }

        bgConnection.onMessage.addListener(rpcListener);
        // ############ MSG_B #1
        bgConnection.postMessage(rpcMsg);

        rpcId += 1;
    });    
}

/**
 * From popup to background is RPC_CALL,
 * reverse is RPC_CALL_response
 * 
 */
export const RPC_CALL = {
    INIT_ACCOUNT: "rpc_init_account",
    ADD_ACCCOUNT: "rpc_add_account",
    CHANGE_ACCOUNT: "rpc_change_account",
    EDIT_ACCOUNT_NAME: "rpc_edit_account_name",
    CONNECT_ACCOUNT: "rpc_connect_account", // real for change account
    NEW_RECIPIENT: "rpc_new_recipient",
    NETWORK_STATE: "rpc_network_state",
    GET_WALLET_PWD: "rpc_get_wallet_pwd",
    SET_WALLET_PWD: "rpc_set_wallet_pwd"
}

export const initAccountRPC = (info) => {
    return rpcCALL(RPC_CALL.INIT_ACCOUNT, info);
}

export const addAccountRPC = (info) => {
    return rpcCALL(RPC_CALL.ADD_ACCCOUNT, info);
}

export const changeAccountRPC = (index) => {
    return rpcCALL(RPC_CALL.CHANGE_ACCOUNT, index);
}

export const editAccountNameRPC = (name) => {
    return rpcCALL(RPC_CALL.EDIT_ACCOUNT_NAME, name);
}

export const newRecipientRPC = (address) => {
    return rpcCALL(RPC_CALL.NEW_RECIPIENT, address);
}

export const networkStateUpdateRPC = (isConnected) => {
    return rpcCALL(RPC_CALL.NETWORK_STATE, isConnected);
}

export const connectAccountRPC = (app, account, ok) => {
    return rpcCALL(RPC_CALL.CONNECT_ACCOUNT, {app, account, ok});
}

export const getWalletPwdRPC = () => {
    return rpcCALL(RPC_CALL.GET_WALLET_PWD, {});
}

export const setWalletPwdRPC = (pwd) => {
    return rpcCALL(RPC_CALL.SET_WALLET_PWD, pwd);
}
