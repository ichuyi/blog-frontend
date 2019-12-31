import md5 from "blueimp-md5";
import { JSEncrypt } from "jsencrypt";
import CryptoJS from "cryptojs";
import fechaObj from "fecha";
const publicKey =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDexXA/QC3gMmFfyYaU3qPGugoK\n" +
  "squddr6uybef4SUIOrhcnBIwWwN2XjkukiErr8vUFgZSmdQLlz3AGPZM+7UR4dxr\n" +
  "Z+mZrgtGln1XpbxoILjeLU9F/w5dQOnsQr+94UpQmoRiEGAdf/hC6EYDmbXOVwwq\n" +
  "sW2vWCX8lKAK97i6sQIDAQAB\n" +
  "-----END PUBLIC KEY-----";
function encryptPassword(password) {
  let md5str = md5(password);
  console.log(md5str);
  let now = fechaObj.format(new Date(), "YYYYMMDDHHmmss");
  let sign = new JSEncrypt();
  sign.setPrivateKey(publicKey);
  sign.encrypt(password + now);
  return md5str;
}
export default {
  encryptPassword
};
