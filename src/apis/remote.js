import store from '../store'
import { Parser, txInfo } from './transaction-parser'
import vue from '../main'
import utils from './utils'

import { MSG_TYPE } from "../scripts/message";
import { sendMessage } from './message'

const S3_URL = "wss://s3.callchain.cc:443"

let __remote = undefined

export const getRemote = async () => {
    if (__remote && await __remote.isConnected()) return __remote

    __remote = createRemote()
    try {
        await __remote.connect()
        return __remote
    } catch (error) {
        console.error("Error in connect remote", error)
        return undefined
    }
}

const createRemote = () => {
    // eslint-disable-next-line
    const remote = new call.CallAPI({server: S3_URL})

    remote.on('error', function(code, msg) {
        console.error('Call connection error, code=' + code + ', msg=' + msg)
        store.dispatch("networkState", false)
    })
    
    remote.on('connected', function() {
        store.dispatch("networkState", true)
    })
    
    remote.on('disconnected', function() {
        store.dispatch("networkState", false)
    })

    remote.on('ledger', function(ledger) {
        store.commit('updateLedger', ledger)
    })
    
    remote.on('transactions', async function(tx) {
        let hash = tx.transaction.hash
        let address = store.getters.currentAddress
        let addressList = store.getters.addressList

        try {
            let info = await remote.getTransaction(hash)

            if (addressList.indexOf(info.address) !== -1) {
                // related account transaction
                sendMessage(MSG_TYPE.TX_RESULT, info);
            }

            // console.log("transaction info")
            // console.dir(info)

            // 2. update effect account data
            if (utils.isAffected(info, address)) {
                // 2.0 update balance
                const balances = await remote.getBalances(address)
                store.commit('updateBalance', balances)

                // 2.1. notify success
                let parse = Parser[info.type] ? Parser[info.type] : Parser['default']
                let desc = parse(info, address)
                if (info.outcome.result != 'tesSUCCESS') {
                    vue.$toast.error('Failed: ' + desc)
                } else {
                    vue.$toast.success(desc)
                }

                // 2.2. update transaction list
                store.commit('newTransaction', txInfo(info, address))
            }
        } catch (error) {
            vue.$toast.error(error.message)
            console.error(error)
        }
    })

    return remote
}
