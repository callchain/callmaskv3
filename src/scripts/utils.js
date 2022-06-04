
const ICON_TEXTS = {
    "icon": true,
    "shortcut icon": true,
    "apple-touch-icon": true,
    "apple-touch-icon-precomposed": true,
    "fluid-icon": true,
    "mask-icon": true    
}


async function getFavicon(pageUrl, target) {
    const head = target.document.head;
    for (let i = 0; i < head.childNodes.length; ++i) {
        const node = head.childNodes[i];
        if (node.nodeName !== "LINK") continue;

        const attributes = node.attributes;
        for (let j = 0; j < attributes.length; ++j) {
            if (ICON_TEXTS[attributes[j].nodeValue]) {
                return node.href;
            }
        }
    }

    return "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + pageUrl + "&size=64";
}

function createUUID() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16) % 16 | 0;
        dt = Math.floor(dt/16);
        return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function getHost(url) {
    let tmpUrl = url.substring(url.indexOf("://")+3);
    if (tmpUrl.indexOf("/") === -1) return tmpUrl

    tmpUrl = tmpUrl.substring(0, tmpUrl.indexOf("/"));
    return tmpUrl;
}

module.exports = {
    getFavicon,
    createUUID,
    getHost
}
