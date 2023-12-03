// eslint-disable-next-line import/no-import-module-exports
import * as CryptoJS from 'crypto-js';
// eslint-disable-next-line camelcase
import jwt_decode from "jwt-decode";
import axios from 'axios';
import Cookies from 'js-cookie';

const { REACT_APP_ENCRYPTION_SECRET } = process.env;

// Initialize the ECB mode and PKCS7 padding
// CryptoJS.mode.ECB = (function () {
//   const ECB = CryptoJS.lib.BlockCipherMode.extend();

//   ECB.Encryptor = ECB.extend({
//     processBlock(words, offset) {
//       this._cipher.encryptBlock.call(this, words, offset);
//     },
//   });

//   ECB.Decryptor = ECB.extend({
//     processBlock(words, offset) {
//       this._cipher.decryptBlock.call(this, words, offset);
//     },
//   });

//   return ECB;
// })();

export const EncryptData = (data, secretKey) => {
  if (!data || !secretKey) {
    console.error('Data or secretKey is undefined.');
    return null; // Or handle the error appropriately
  }
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return encryptedData;
};

export const DecryptData = (data, secretKey) => {
  if (!data || !secretKey) {
    console.error('Data or secretKey is undefined.');
    return null; // Or handle the error appropriately
  }
  const decryptedData = CryptoJS.AES.decrypt(data, secretKey);
  const decryptedRequestData = decryptedData.toString(CryptoJS.enc.Utf8);
  try {
    return JSON.parse(decryptedRequestData);
  } catch (error) {
    console.error('Error parsing decrypted data:', error);
    return null; // Or handle the error appropriately
  }
};

export const GetMetadata = (data, jwtSecret, encSecret) => {
  const decodedRes = jwt_decode(data, jwtSecret);
  const decryptedRes = DecryptData(decodedRes.payload, encSecret);
  return { decodedRes, decryptedRes }
};


// eslint-disable-next-line consistent-return
export const SendRequest = async (baseURL, request) => {
  const token = Cookies.get('session');
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const instance = axios.create({
    baseURL, // Replace with your API base URL
    headers,
    withCredentials: true,
  });

  const encryptedRequest = EncryptData(request, REACT_APP_ENCRYPTION_SECRET);

  const req = { request: encryptedRequest };
  console.log('SendRequest', req);

  try {
    const res = await instance.post(baseURL, JSON.stringify(req));
    const response = DecryptData(res.data.message.Result, REACT_APP_ENCRYPTION_SECRET);
    if (response) {
      res.data.message.Result = response;
    } else {
      console.error('Error decrypting response data.');
    }
    return res;
  } catch (error) {
    console.error('Error sending request:', error);
  }
};

export const SendRequestExt = (baseURL) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const instance = axios.create({
    baseURL, // Replace with your API base URL
    headers,
  });

  return instance;
};

