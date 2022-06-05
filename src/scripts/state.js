/**
 * Mnemonic and secret are all encrypted by user password
 */
const _callState = {
    accounts: [],
    currentAccIndex: 0,
    mnemonic: undefined,
    nextAccountIndex: 0,
    recipients: [],
    // app => account[]
     whitelist: {},

    // dynamic info
    pendingConnections: [],
    pendingSigns: [],
    pendingTransactions: [],

    // temp state
    connected: false,
    walletPwd: undefined
}

export const _setItem = async (key, value) => {
    browser.storage.local.set({
        [key]: value
    });
}

export const _getItem = async (key) => {
    const stored = await browser.storage.local.get(key);
    try {
        const obj = JSON.parse(stored);
        if (obj.accounts) return obj
    } catch (e) {
        // eslint-disable-next-line
    }

    return null;
}

export const getCurrentAccounts = (app) => {
    return _callState.whitelist[app] || []
}

export const disconnectUpdate = async (app) => {
    _callState.whitelist[app] = undefined;

    await saveState();
}

export const connectAccountUpdate = async (info) => {
    const accountList = info.account;
    let list = _callState.whitelist[info.app] || [];
    let changed = false;

    for (let k = accountList.length - 1; k >= 0; --k) {
        const item = accountList[k];
        let i = 0;
        for (; i < list.length; ++i) {
            if (list[i] === item) break;
        }
        if (info.ok) {
            if (i === list.length) {
                list = [item].concat(list);
                changed = true;
            } else {
                if (i !== 0) {
                    const _tmpItem = list[0];
                    list[0] = list[i];
                    list[i] = _tmpItem;
                    changed = true;
                }
            }
        } else {
            if (i < list.length) {
                list.splice(i, 1);
                changed = true;
            }
        }
    }

    _callState.whitelist[info.app] = list;
    await saveState();

    return {changed, list};
}

const storeId = () => {
    return browser.runtime.id + "-callstore"
}

export const restoreState = async () => {
    const _id = storeId();
    const obj = await _getItem(_id);

    if (obj) {
        _callState.accounts = obj.accounts;
        _callState.currentAccIndex = obj.currentAccIndex;
        _callState.mnemonic = obj.mnemonic;
        _callState.nextAccountIndex = obj.nextAccountIndex;
        _callState.recipients = obj.recipients;
        _callState.whitelist = obj.whitelist;
    }
}

const saveState = async () => {
    const to_saved_state = {
        accounts: _callState.accounts,
        currentAccIndex: _callState.currentAccIndex,
        mnemonic: _callState.mnemonic,
        nextAccountIndex: _callState.nextAccountIndex,
        recipients: _callState.recipients,
        whitelist: _callState.whitelist
    }
    const _id = storeId();
    await _setItem(_id, JSON.stringify(to_saved_state));
}

export const initAccountUpdate = async (info) => {
    _callState.mnemonic = info.encMnemonic;
    _callState.walletPwd = info.encPassword; // tmp state
    const accounts = info.accounts;
    for (let i = 0; i < accounts.length; ++i) {
        accounts[i]["name"] = "Account" + (i+1);
        accounts[i]["derived"] = true;
    }

    _callState.accounts = accounts;
    _callState.nextAccountIndex = accounts.length;

    await saveState();
    return true;
}

export const setWalletPwdUpdate = (info) => {
    _callState.walletPwd = info.encPassword;
    return true;
}

export const getWalletPwd = () => {
    return _callState.walletPwd;
}

export const getNetworkState = () => {
    return _callState.connected;
}

export const addAccountUpdate = async (info) => {
    _callState.accounts = _callState.accounts.concat(info);
    if (info.derived) {
        _callState.nextAccountIndex += 1;
    }

    await saveState();
    return true;
}

export const changeAccountUpdate = async (index) => {
    if (index >= 0 && index < _callState.accounts.length) {
        _callState.currentAccIndex = index;
    }

    await saveState();
    return _callState.accounts[_callState.currentAccIndex]
}

export const editAccountNameUpdate = async (name) => {
    const accounts = _callState.accounts;
    accounts[_callState.currentAccIndex].name = name;
    _callState.accounts = accounts;

    await saveState();
    return true;
}

export const newRecipientUpdate = async (address) => {
    const got = _callState.recipients.find((item) => item == address);
    if (!got) {
        _callState.recipients = _callState.recipients.concat(address);
    }

    await saveState();
    return true;
}

export const networkStateUpdate = (isConnected) => {
    _callState.connected = isConnected;
}

//======
const SUPPORT_TRANDACTIONS = [
    "Payment", "TrustSet", "IssueSet", "OfferCreate", "OfferCancel", "AccountSet", "SetRegularKey"
];

export const checkSubmitParams = (info) => {
    if (info.instructions === undefined) return "Missing instructions param";
    if (info.instructions.fee === undefined) return "Missing instructions.fee param";
    if (info.instructions.sequence === undefined) return "Missing instructions.sequence param";

    if (!info.txJSON) return "Missing txJSON param";
    if (typeof info.txJSON !== 'string') return 'Invalid type of txJSON param';

    let tx = null;
    try {
        tx = JSON.parse(info.txJSON);
    } catch (e) {
        return 'invalid json of txJSON param';
    }

    if (!tx.TransactionType) return 'Missing txJSON.TransactionType param';
    if (SUPPORT_TRANDACTIONS.indexOf(tx.TransactionType) === -1) return "Not supported txJSON.TransactionType " + tx.TransactionType;

    if (!tx.Account) return 'Missing txJSON.Account param';

    const app = info.app;
    const _whitelist = getCurrentAccounts(app);
    if (_whitelist.indexOf(tx.Account) === -1) return "Account not connected";

    return undefined;
}