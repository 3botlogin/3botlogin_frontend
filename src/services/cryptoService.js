import bip39 from 'bip39'
import { encodeBase64, decodeUTF8, decodeBase64 } from 'tweetnacl-util'
const sodium = require('libsodium-wrappers')

export default ({
  generateKeys (phrase) {
    return new Promise(async (resolve, reject) => {
      console.log(`phrase`, phrase)
      if (!phrase) phrase = bip39.entropyToMnemonic(sodium.randombytes_buf(sodium.crypto_box_SEEDBYTES / 2))
      console.log(`phrase`, phrase)
      var ken = new TextEncoder().encode(bip39.mnemonicToEntropy(phrase))
      var keys = sodium.crypto_sign_seed_keypair(ken)
      resolve({
        phrase,
        privateKey: encodeBase64(keys.privateKey),
        publicKey: encodeBase64(keys.publicKey)
      })
    })
  },
  validateSignature (message, signature, publicKey) {
    console.log(`Validating ${message}, ${signature}, ${publicKey}`)
    return new Promise(async (resolve, reject) => {
      publicKey = decodeBase64(publicKey)
      signature = decodeBase64(signature)
      signature = decodeBase64(signature)
      resolve(sodium.crypto_sign_open(signature, publicKey))
    })
  }
})
