
export const EXT_NAME = "callmask";

export const POPUP_WINDOW_NAME = "callmask_extension_popup";

export const SENDER = {
    API: "api",
    CONTENT: "content",
    BACKGROUND: "backgound",
    POPUP: "popup"
}

export const MSG_TYPE = {
    /**
     * message from inpage -> content script -> background -> popup
     * identify by sender, and return back with _result
     */
    CONNECT: "call_connect",
    CONNECT_RESULT: "call_connnect_result",

    DISCONNECT: "call_disconnect",
    DISCONNECT_RESULT: "call_disconnect_result",

    CURRENT_ACCOUNTS: "call_current_accounts",
    CURRENT_ACCOUNTS_RESULT: "call_current_accounts_result",

    SIGN: "call_sign",
    SIGN_RESULT: "call_sign_result",

    SUBMIT: "call_submit",
    SUBMIT_RESULT: "call_submit_result",
    

    /**
     * message from popup to backgound -> content script -> inpage
     * identify by sender
     * 
     */
    ACCOUNT_CHANGED: "call_account_changed",
    NETWORK_STATE: "call_network_state",
    TX_RESULT: "call_tx_result",

    /**
     * FROM UI
     * 
     * Message from popup to backgound
     * 
     */
    POPUP_INITIALIZED: "call_popup_initialized",

    /**
     * FROM UI
     * for confirm action from popup to background
     * 
     */
    POPUP_CONFIRM: "call_popup_confirm"

}


export const validateMessage = (message, { sender, type }) => {
    // No message
    if (!message) return false;

    if (message.ext !== "callmask" || // not callmask extension
            !message.sender || // no sender field
            !message.type) // no type field
        return false;
    
    // sender field not required
    if (sender && message.sender !== sender) return false;
    // type field not required
    if (type && message.type !== type) return false;

    return true;
}