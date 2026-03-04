import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  //The set method is use to encrypt the value.
  set(keys: any, value: any) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    return encodeURI(encrypted.toString());
  }

  //The get method is use to decrypt the value.
  get(keys: any, value: any) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  //Decode data from backend.
  decodeData(data: any) {
    const key = 'mysecretkey12345';
    //decryption
    const decodedData = this.get(key, data);
    const decryptedData = decodedData.toString();
    return JSON.parse(decryptedData);
  }
}
