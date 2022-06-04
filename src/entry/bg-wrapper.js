/* eslint-disable */

try {
    if ('function' === typeof importScripts) {
        importScripts('/libs/lodash.min.js');
        importScripts('/libs/call.min.js');
        importScripts('/libs/browser-polyfill.min.js');
        importScripts('/background.js');
    }
} catch (error) {
    console.error(error);
}
