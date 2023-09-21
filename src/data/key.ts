export default {
  "environment": {
    "type": 0 //0: local world, 1: Realm, 2: Server
  },
  "operator": {
    "passworld": 'I_am_an_admin',
    "hash": {
      "state": false,
      "method": undefined
      /*
        Only keep the hash of the passworld can protect your server,
        It can prevent passworld get used by other player.
        Supported method: SHA1, SHA256, SHA512
      */
    },
    "ReadOnly": false,
    "VerifyOp": false
  }
}