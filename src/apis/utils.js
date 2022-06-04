const _ = require('lodash')
const url = require('url')
// const { parseFavicon } = require('parse-favicon')

function formatMnemonic(input) {
    let array = input.split(' ')
    let formated = _.remove(array, function(item) {
        return item !== ''
    })

    return formated.join(' ')
}

function isValidAddr(addr) {
    return /^c[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(addr);
}

const cutils = call.CallAPI._PRIVATE;

function isValidSec(seed) {
    return cutils.schemaValidator.isValidSecret(seed);
}

function isAffected(obj, addr) {
    for (let prop in obj) {
        // check key
        if (prop === addr) return true

        // check value
        let value = obj[prop]
        if (typeof value === 'object'){
            if (isAffected(value, addr)) return true
        } else {
            if (value === addr) return true
        }
    }
    return false
}

async function getCurrentApp() {
    const query = await browser.tabs.query({currentWindow: true});
    for (let i = 0; i < query.length; ++i) {
        const item = query[i];
        if (item.active) {
            const urlObj = url.parse(item.url);
            const app = urlObj.host;
            return {
                app: app,
                favIcon: item.favIconUrl
            }
        }
    }
}

module.exports = {
    formatMnemonic,
    isAffected,
    isValidAddr,
    isValidSec,

    getCurrentApp
}
