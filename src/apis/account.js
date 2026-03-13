const bip39 = require('bip39');
const { Wallet } = require('@callchain/call-core-lib');
const { DERIVE_PATH } = require('./constant');
const derivePath = require('ed25519-hd-key').derivePath;

const ENTROPY_BITS = 128; // 12 words
const LANGUAGE = 'english';

const wallet = require('./wallet');
const _ = require('lodash');

const getAccountFromSecret = function(secret) {
    try {
        const wallet = Wallet.fromSeed(secret);
        return { secret, address: wallet.address };
    } catch (error) {
        console.error('Invalid secret:', error);
        throw error;
    }
}

const getAccountFromEntropy = function(key) {
    try {
        // Generate seed from entropy
        const seed = generateSeedFromEntropy(key);
        const wallet = Wallet.fromSeed(seed);
        return { secret: seed, address: wallet.address };
    } catch (error) {
        console.error('Error deriving account from entropy:', error);
        throw error;
    }
}

function generateSeedFromEntropy(entropy) {
    // Use call-core-lib's Wallet to generate seed
    const wallet = Wallet.generate();
    return wallet.seed;
}

function generateMnemonic() {
    const wordlist = bip39.wordlists[LANGUAGE]
    let mnemonic = bip39.generateMnemonic(ENTROPY_BITS, null, wordlist)
    return mnemonic;
}

function validMnemonic(mnemonic) {
    const wordlist = bip39.wordlists[LANGUAGE]
    return bip39.validateMnemonic(mnemonic, wordlist)
}

async function createWalletFromMnemonic(mnemonic, index) {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const seedHex = seed.toString('hex');
    const path = DERIVE_PATH.replace('index', index);
    const data = derivePath(path, seedHex);
    const account = getAccountFromEntropy(data.key);

    return account;
}

function createWalletFromSecret(secret) {
    return getAccountFromSecret(secret);
}

const ADDRESS_GAP_LIMIT = 6;

async function prepareAccounts(mnemonic, imported) {
    let accounts = [];
    let account = await createWalletFromMnemonic(mnemonic, 0);
    accounts.push(account);

    if (!imported) return accounts;

    let temp_accounts = []
    let gap = 0;
    let i = 1;
    // Account discovery
    for(;;) {
        account = await createWalletFromMnemonic(mnemonic, i);
        const info = await wallet.getAccountInfo(account.address);
        temp_accounts.push(account);

        if (_.isEmpty(info)) {
            ++gap;
            if (gap >= ADDRESS_GAP_LIMIT) break;
        } else {
            accounts = accounts.concat(temp_accounts);
            temp_accounts = [];
            gap = 0;
        }

        ++i;
    }

    return accounts;
}

module.exports = {
    generateMnemonic,
    validMnemonic,
    createWalletFromMnemonic,
    createWalletFromSecret,

    prepareAccounts
}
