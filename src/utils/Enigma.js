// eslint-disable-next-line import/no-import-module-exports
import * as CryptoJS from 'crypto-js';
// eslint-disable-next-line camelcase
import jwt_decode from "jwt-decode";
import axios from 'axios';

// Initialize the ECB mode and PKCS7 padding
CryptoJS.mode.ECB = (function () {
  const ECB = CryptoJS.lib.BlockCipherMode.extend();

  ECB.Encryptor = ECB.extend({
    processBlock(words, offset) {
      this._cipher.encryptBlock.call(this, words, offset);
    },
  });

  ECB.Decryptor = ECB.extend({
    processBlock(words, offset) {
      this._cipher.decryptBlock.call(this, words, offset);
    },
  });

  return ECB;
})();

export const EncryptData = (data, secretKey) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return encryptedData;
};

export const DecryptData = (data, secretKey) => {
  const decryptedData = CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
  const decryptedRequestData = JSON.parse(decryptedData);
  return decryptedRequestData;
};

export const GetMetadata = (data, jwtSecret, encSecret) => {
  const decodedRes = jwt_decode(data, jwtSecret);
  const decryptedRes = DecryptData(decodedRes.payload, encSecret);
  return { decodedRes, decryptedRes }
};

export const GetCookie = (name) => {
  const cookieValue = document.cookie.split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(`${name}=`));

  if (cookieValue) {
    return cookieValue.substring(name.length + 1);
  } 
    return null;
};


export const SendRequest = (baseURL) => {
  const token = GetCookie('session')
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const instance = axios.create({
    baseURL, // Replace with your API base URL
    headers,
  });

  return instance;
};


