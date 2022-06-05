import { isEmpty } from "lodash"
import { getRemote } from "./remote"
import { txInfo } from "./transaction-parser"

export const getBalances = async (address) => {
    if (!address) {
        return [{currency: 'CALL', value: 0}]
    }
    try {
        const remote = await getRemote()
        return await remote.getBalances(address)
    } catch (error) {
        if (error && error.message !== 'actNotFound') {
            console.error("Error in getBalances", error)
        }
        return [{currency: 'CALL', value: 0}]
    }
}

export const getAccountInfo = async (address) => {
    if (!address) {
        return {}
    }
    try {
        const remote = await getRemote()
        return await remote.getAccountInfo(address)
    } catch (error) {
        if (error && error.message !== 'actNotFound') {
            console.error("Error in getAccountInfo", error)
        }
        return {}
    }
}

export const getTransactions = async (address, options) => {
    const remote = await getRemote()
    const list = await remote.getTransactions(address, options)

    const result = []
    for (let i = 0; i < list.results.length; ++i) {
        const tx = list.results[i]
        if (isEmpty(tx)) continue
        result.push(txInfo(tx, address))
    }

    return result
}

export const getIssueList = async (address) => {
    try {
        const remote = await getRemote()
        return await remote.getAccountIssues(address)
    } catch (error) {
        console.error("Error in getAccountIssues", error)
        return []
    }
}

const doSubmit = async (remote, account, txJSON) => {
    const secret = account.secret
    try {
        const signedTx = remote.sign(txJSON, secret)
        const tx = await remote.submit(signedTx, true)
        return {
            success: tx.resultCode == 'tesSUCCESS',
            data: signedTx.id,
            msg: tx.resultCode
        }
    } catch (error) {
        console.error("Error in doSubmit", error)
        return {
            success: false,
            msg: error
        }
    }
}

export const doSubmitTx = async (account, txJSON) => {
    try {
        const remote = await getRemote()
        return await doSubmit(remote, account, txJSON)
    } catch (error) {
        console.error("Error in do doSubmitTx", error)
        return {
            success: false,
            msg: error
        }
    }
}

export const doTrustline = async (account, item) => {
    try {
        const remote = await getRemote()
        const trustline = {
            currency: item.specification.currency,
            counterparty: item.specification.issuer,
            limit: item.specification.value,
            callingDisabled: true
        }
        const prepare = await remote.prepareTrustline(account.address, trustline)
        return await doSubmit(remote, account, prepare.txJSON)
    } catch (error) {
        console.error("Error in do trust", error)
        return {
            success: false,
            msg: error
        }
    }
}

export const doPayment = async (account, to, amount, item) => {
    try {
        const remote = await getRemote()
        const sendAmount = {
            value: amount,
            currency: item.currency,
            issuer: item.counterparty
        }
        const payment = {
            source: {
                address: account.address,
                maxAmount: sendAmount
            },
            destination: {
                address: to,
                amount: sendAmount
            },
            memos: []
        }
        const prepare = await remote.preparePayment(account.address, payment)
        return await doSubmit(remote, account, prepare.txJSON)
    } catch (error) {
        console.error("Error in do payment", error)
        return {
            success: false,
            msg: error
        }
    }
}
