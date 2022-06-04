const STORAGE_KEY = "callmask-storage"

export const setItem = (item, callback) => {
    const _callback = callback || function() {}
    browser.storage.local.set({[STORAGE_KEY]: item}, _callback)
}

export const getItem = () => {
    return new Promise(function(resolve, reject) {
        browser.storage.local.get(STORAGE_KEY, function(result) {
            resolve(result)
        })
    })
}