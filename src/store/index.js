import Vue from "vue"
import Vuex from "vuex"

import BN from 'bignumber.js'
const ZERO = new BN(0)

import { decryptAES } from '../apis/cryptor'
import { getAccountInfo, getBalances, getTransactions } from "../apis/wallet"

import {
    initAccountRPC,
    addAccountRPC,
    changeAccountRPC,
    editAccountNameRPC,
    newRecipientRPC,
    networkStateUpdateRPC,
    connectAccountRPC,
    setWalletPwdRPC
} from '../apis/message'

Vue.use(Vuex)

const EMPTY_LEDGER = {
    reserveIncrementCALL: 0,
    reserveBaseCALL: 0
}

const EMPTY_ACCOUNT = {
    ownerCount: 0
}

const EMPTY_ACCOUNT_ITEM = {
    name: undefined,
    address: undefined
}

const store = new Vuex.Store({
    state: {
        isShowConnected: false,
        isShowToConnect: false,

        networkState: false,
        ledger: EMPTY_LEDGER,
        balance: ZERO,
        balances: {},
        accountInfo: EMPTY_ACCOUNT,
        transactions: [],
        marker: undefined,
        trustlines: {},

        // site => accounts
        whitelist: {},

        // persist state
        currentAccIndex: 0,
        accounts: [],
        recipients: [],
        mnemonic: undefined, // enc
        nextAccountIndex: 0,

        // temp state
        walletPwd: undefined // enc
    },
    getters: {
        reservedCALL: (state) => {
            return new BN(state.ledger.reserveIncrementCALL).times(state.accountInfo.ownerCount)
                .plus(state.ledger.reserveBaseCALL)
        },
        accountIndex: (state) => {
            return state.nextAccountIndex
        },
        currentAddress: (state) => {
            const account = state.accounts[state.currentAccIndex]
            if (!account) return undefined
            return account.address
        },
        currentAccount: (state) => {
            const account = state.accounts[state.currentAccIndex]
            if (!account) return EMPTY_ACCOUNT_ITEM
            return account
        },
        currentIndex: (state) => {
            return state.currentAccIndex
        },
        callBalance: (state) => {
            return state.balance
        },
        balanceList: (state) => {
            return state.balances
        },
        transactionList: (state) => {
            return state.transactions.filter(item => !!item)
        },
        mnemonicSaved: (state) => {
            return decryptAES(state.mnemonic, state.walletPwd)
        },
        passwordSaved: (state) => {
            return state.walletPwd;
        },
        accountList: (state) => {
            return state.accounts
        },
        addressList: (state) => {
            return state.accounts.map(item => item.address)
        },
        accountCount: (state) => {
            return state.accounts.length
        }
    },
    mutations: {
        _updateConnect(state, data) {
            const info = data.info
            const accountList = data.accountList

            let _whitelist = state.whitelist[info.app] || []
            for (let k = accountList.length - 1; k >= 0; --k) {
                const item = accountList[k]
                let i = 0;
                for (; i < _whitelist.length; ++i) {
                    if (_whitelist[i] === item) break;
                }
                if (i === _whitelist.length) {
                    // not found
                    _whitelist = [item].concat(_whitelist)
                } else {
                    // move to first
                    const _tmpItem = _whitelist[i]
                    _whitelist[i] = _whitelist[0]
                    _whitelist[0] = _tmpItem
                }
            }

            Vue.set(state.whitelist, info.app, _whitelist)
        },
        _updateDisconnect(state, info) {
            const app = info.app.app
            const address = info.account

            let _list = state.whitelist[app] || []
            let i = 0;
            for (; i < _list.length; ++i) {
                if (_list[i] === address) break
            }
            if (i === _list.length) return

            state.whitelist[app].splice(i, 1)
        },

        setShowConnected(state, ok) {
            state.isShowConnected = ok
        },
        setShowToConnect(state, ok) {
            state.isShowToConnect = ok
        },

        _initAccount(state, info) {
            state.mnemonic = info.encMnemonic
            state.walletPwd = info.encPassword
            const accounts = info.accounts
            for (let i = 0; i < accounts.length; ++i) {
                accounts[i]["name"] = "Account " + (i+1)
                accounts[i]["derived"] = true
            }

            state.accounts = accounts
            state.nextAccountIndex = info.accounts.length
        },
        _decAccount(state, info) {
            state.walletPwd = info.encPassword
            state.accounts = info.accounts
        },
        _addAccount(state, info) {
            state.accounts = state.accounts.concat(info)
            if (info.derived) {
                state.nextAccountIndex += 1
            }
        },
        _changeAccount(state, index) {
            if (index >= 0 && index < state.accounts.length) {
                state.currentAccIndex = index
            }
        },
        _changeAccountName(state, name) {
            const accounts = state.accounts
            accounts[state.currentAccIndex].name = name
            state.accounts = accounts
        },
        _newRecipient(state, address) {
            const got = state.recipients.find((item) => item == address)
            if (got) return
            state.recipients = state.recipients.concat(address)
        },

        _networkState(state, isConnected) {
            state.networkState = isConnected
        },

        updateLedger(state, ledger) {
            state.ledger = ledger
        },

        updateBalance(state, info) {
            const result = {}
            for (let i = 0; i < info.length; ++i) {
                const item = info[i]
                const key = item.counterparty ? item.currency + '@' + item.counterparty : item.currency
                result[key] = item
                result[key].value = new BN(item.value)
            }
            state.balances = result

            state.balance = state.balances['CALL'].value
        },
        updateTrustlines(state, info) {
            const result = {}
            for (let i = 0; i < info.results.length; ++i) {
                const item = info.results[i]
                const key = item.specification.currency + '@' + item.specification.counterparty
                result[key] = {
                    currency: item.specification.currency,
                    counterparty: item.specification.counterparty,
                    limit: new BN(item.specification.limit),
                    balance: ZERO
                }
            }
            state.trustlines = result
        },
        updateTransactions(state, result) {
            state.transactions = result
        },
        newTransaction(state, info) {
            state.transactions = [info].concat(state.transactions)
        },
        updateAccountInfo(state, info) {
            state.accountInfo = info
        }

    },
    actions: {
        initAccount({commit}, info) {
            commit("_initAccount", info)
            initAccountRPC({encMnemonic: info.encMnemonic, encPassword: info.encPassword, accounts: info.enc_accounts})
        },
        addAccount({commit}, info) {
            commit("_addAccount", info.account)
            addAccountRPC(info.enc_account)
        },
        changeAccount({commit}, index) {
            commit("_changeAccount", index)
            changeAccountRPC(index)
        },
        changeAccountName({commit}, name) {
            commit("_changeAccountName", name)
            editAccountNameRPC(name)
        },
        newRecipient({commit}, address) {
            commit("_newRecipient", address)
            newRecipientRPC(address)
        },
        networkState({commit}, isConnected) {
            commit("_networkState", isConnected)
            networkStateUpdateRPC(isConnected)
        },
        updateConnect({commit}, data) {
            const info = data.info
            const accountList = data.accountList
            commit("_updateConnect", {info, accountList})
            // rpc call
            const app = info.app
            connectAccountRPC(app, accountList, true)
        },
        updateDisconnect({commit}, info) {
            commit("_updateDisconnect", info)
            // rpc call
            const app = info.app.app
            const address = info.account
            connectAccountRPC(app, [address], false)
        },
        decAccount({commit, state}, info) {
            const encPassword = info.encPassword // encrypted
            const dec_accounts = state.accounts
            for (let i = 0; i < dec_accounts.length; ++i) {
                dec_accounts[i].secret = decryptAES(dec_accounts[i].secret, encPassword)
            }
            commit("_decAccount", {encPassword, accounts: dec_accounts})

            // rpc call
            if (info.callRPC) {
                setWalletPwdRPC({encPassword})
            }
        },
        changeView({commit, state}, info) {
            const appInfo = info.app
            const index = info.index
            /**
             * Show when current app connected but switch to not connected
             */
            const fromAccount = state.accounts[state.currentAccIndex]
            const toAccount = state.accounts[index]
            const showSwitch = state.whitelist[appInfo.app] &&
                state.whitelist[appInfo.app].indexOf(fromAccount.address) !== -1 &&
                state.whitelist[appInfo.app].indexOf(toAccount.address) === -1
            
            commit("_changeAccount", index)
            changeAccountRPC(index)

            if (showSwitch) commit ("setShowToConnect", true)

            const reInit = async function() {
                const address = state.accounts[state.currentAccIndex].address

                const balances = await getBalances(address)
                commit("updateBalance", balances)

                const info = await getAccountInfo(address)
                commit("updateAccountInfo", info)

                const transactions = await getTransactions(address, {limit: 10})
                commit("updateTransactions", transactions)
            }
            reInit()
        }
    },
    modules: {},
})

export default store