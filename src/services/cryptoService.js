import nacl from 'tweetnacl'
import bip39 from 'bip39'
import { encodeBase64 } from 'tweetnacl-util'

export default ({
  generateAsymmetricKeypair () {
    return new Promise(async (resolve, reject) => {
      var seed = nacl.randomBytes(32)
      var phrase = bip39.entropyToMnemonic(seed)
      var keys = await nacl.sign.keyPair.fromSeed(seed)
      resolve({
        phrase,
        privateKey: encodeBase64(keys.secretKey),
        publicKey: encodeBase64(keys.publicKey)
      })
    })
  }
//   ,
//   generateKeysFromPhrase (phrase) {
//     return new Promise(async (resolve, reject) => {
//       var typedArray = new Uint8Array(bip39.mnemonicToEntropy(phrase).match(/[\da-f]{2}/gi).map(x => parseInt(x, 16)))
//       var keys = await nacl.sign.keyPair.fromSeed(typedArray)
//     })
//   }
})
