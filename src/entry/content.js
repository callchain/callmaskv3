import { EXT_NAME, MSG_TYPE, SENDER, validateMessage } from "../scripts/message";
import { getFavicon, createUUID, getHost } from '../scripts/utils';

const injectScript = async() => {
    try {
        const container = document.head || document.documentElement;
        const scriptTag = document.createElement('script');
        scriptTag.type = 'text/javascript';
        const url = browser.runtime.getURL('inpage.js');
        scriptTag.src = url;
        container.appendChild(scriptTag);
    } catch (error) {
        console.error("CallMask: Injection failed", error)
    }
}

injectScript();

const CID = createUUID();

const connection = browser.runtime.connect(browser.runtime.id, {
    name: "backgroundConnection-" + CID,
    includeTlsChannelId: true
});

/**
 * Receive message from inpage and forward message from inpage to background
 * 
 */
// ############ MSG_A #2
window.addEventListener("message", async (e) => {
    if (!validateMessage(e.data, {sender: SENDER.API}) || !e.data.type) return;

    // from background
    const listener = async (res) => {
        // ############ MSG_A #10

        // only resolve when the result matching our message.id is deleivered
        if (res.id != e.data.id) return;

        if (
            res.ext !== EXT_NAME || // not callmask extension
            res.type !== `${e.data.type}_result` // not response result message
        )
          return;

        // Message from content scrip to inpage
        const next_msg = res;
        next_msg.sender = SENDER.CONTENT;
        // ############ MSG_A #11
        window.postMessage(next_msg, window.location.origin);
        connection.onMessage.removeListener(listener);
    };

    /**
     * Send message from content script to background
     */
    const forward_msg = e.data;
    forward_msg.cid = CID;
    forward_msg.sender = SENDER.CONTENT;
    forward_msg.data = forward_msg.data || {}
    forward_msg.data["app"] = getHost(e.origin);

    const logo = await getFavicon(e.origin, e.currentTarget);
    forward_msg.data["logoUrl"] = logo;
    forward_msg.data["width"] = document.body.clientWidth;

    // ############ MSG_A #3
    connection.postMessage(forward_msg);
    connection.onMessage.addListener(listener);
});

/**
 * Message from background and forward to inpage
 */
connection.onMessage.addListener(async (message) => {
    // ############ MSG_C #4

    if (!validateMessage(message, {sender: SENDER.BACKGROUND})) return;
    // if (message.id) return;
    
    if (message.type !== MSG_TYPE.ACCOUNT_CHANGED &&
            message.type !== MSG_TYPE.NETWORK_STATE &&
            message.type !== MSG_TYPE.TX_RESULT)
        return;
    
    
    const fmsg = message;
    fmsg.sender = SENDER.CONTENT;
    // ############ MSG_C #5
    window.postMessage(fmsg, window.location.origin);
})
