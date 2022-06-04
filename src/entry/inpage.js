// require("extensionizer");
import SafeEventEmitter from '@metamask/safe-event-emitter';
import { remoteAPI } from '../scripts/remoteAPI';
import { MSG_TYPE, SENDER, validateMessage } from '../scripts/message';

console.log("Callchain injected");

class CallchainAPI extends SafeEventEmitter {
    constructor() {
        super();
        this.setMaxListeners(100);

        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.getCurrentAccounts = this.getCurrentAccounts.bind(this);
        // this.sign = this.sign.bind(this);
        this.submit = this.submit.bind(this);
    }

    async connect() {
        const data = await remoteAPI({
            type: MSG_TYPE.CONNECT
        });

        if (!data.res) throw new Error(data.message);

        return data.res;
    }

    async disconnect() {
        const data = await remoteAPI({
            type: MSG_TYPE.DISCONNECT
        });

        if (!data.res) throw new Error(data.message);
        return data.res;
    }

    async getCurrentAccounts() {
        const data = await remoteAPI({
            type: MSG_TYPE.CURRENT_ACCOUNTS
        });

        if (!data.res) throw new Error(data.message);
        return data.res;
    }

    // async sign(transaction) {
    //     try {
    //         const data = await remoteAPI({
    //             type: MSG_TYPE.SIGN,
    //             data: transaction
    //         });

    //         if (!data.res) throw new Error(data.message);
    //         return data.res;
    //     } catch (error) {
    //         throw new Error(error);
    //     }
    // }

    async submit(prepared) {
        const data = await remoteAPI({
            type: MSG_TYPE.SUBMIT,
            data: prepared
        });

        if (!data.res) throw new Error(data.message);
        return data.res;
    }
}

const callchainAPI = new CallchainAPI();

/**
 * Listen message from content script for
 *      ACCOUNT_CHANGED
 *      NETWORK_STATE
 *      TX_RESULT
 */
window.addEventListener("message", (e)=> {    
    // ############ MSG_C #6
    // only message from content script
    if (!validateMessage(e.data, {sender: SENDER.CONTENT}))
        return;

    // only specified message type
    const type = e.data.type;
    if (type !== MSG_TYPE.ACCOUNT_CHANGED &&
        type !== MSG_TYPE.NETWORK_STATE &&
        type !== MSG_TYPE.TX_RESULT)
        return;
    
    // console.log("Message from content script");
    // console.dir(e.data);

    // ############ MSG_C #7
    callchainAPI.emit(e.data.type, e.data.res);
})

window.callchain = callchainAPI;
