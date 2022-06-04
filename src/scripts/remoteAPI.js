import { validateMessage, EXT_NAME, SENDER } from './message'

let messageId = 1;

export const remoteAPI = (message) => {
    return new Promise((resolve, reject) => {
        const id = messageId;
        message.id = id;
        messageId += 1;

        /**
         * Post message to content script
         */
        // ############ MSG_A #1
        window.postMessage(
            {...message, ext: EXT_NAME, sender: SENDER.API},
            window.location.origin
        );

        /**
         * Wait for content script response
         */
        window.addEventListener("message", callback);

        /**
         * Callback for content script response message
         * @param {*} e 
         * @returns 
         */
        function callback(e) {
            // ############ MSG_A #12
            if (!validateMessage(e.data, {
                    type: `${message.type}_result`,
                    sender: SENDER.CONTENT
                })
            )
            return;
            
            if (id != e.data.id) return;

            // console.log("Response data");
            // console.dir(e.data);

            window.removeEventListener("message", callback);
            if (e.data.res === false) reject(e.data.message);
            else resolve(e.data);
        }
    });
}