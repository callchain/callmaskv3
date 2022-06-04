const CryptoJS = require('crypto-js');
const _ = require('lodash')

const encryptMD5 = function(string) {
  return CryptoJS.MD5(string).toString().toLocaleUpperCase();
}

const genKey = function(key) { // 生成16位的key
  return (Array(16).join('A') + key).slice(-16);
}

const encryptAES = function(string, key) {
  if(typeof(string) == 'object'){
    string = JSON.stringify(string);
  }
  let srcs = CryptoJS.enc.Utf8.parse(string);
  const iv = CryptoJS.enc.Utf8.parse(genKey(key));
  return CryptoJS.AES.encrypt(srcs,  CryptoJS.enc.Utf8.parse(genKey(key)), {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString();
}

const decryptAES = function(string, key) {
  const iv = CryptoJS.enc.Utf8.parse(genKey(key));
  let val = CryptoJS.AES.decrypt(string, CryptoJS.enc.Utf8.parse(genKey(key)), {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
  return val.toString(CryptoJS.enc.Utf8);
}

const checkPassword = function(pass, savedPwd, savedMnemonic) {
  const encPass = encryptMD5(pass);
  let result = false;
  if (savedPwd) {
    result = (encPass === savedPwd);
  } else {
    try {
      const deout = decryptAES(savedMnemonic, encPass)
      result = !_.isEmpty(deout)
    } catch (e) {
      console.error("Error in check pass", e);
    }
  }

  return result;
}

module.exports = {
  encryptMD5,
  encryptAES,
  decryptAES,
  checkPassword
}

