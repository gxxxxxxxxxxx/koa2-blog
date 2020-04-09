const qiniu = require('qiniu')

const accessKey = 'VDV6wHKWNcnIgLfRqAlVYHfbOgToD3xm_tPfX0Q6'
const secretKey = 'fGcJbpmycXQhQMnx2dzXsBhjVt6-Nb8pTEJ6RhVz'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const options = {
    scope:'ganxx1',
    expires: 7200
  }

  var putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac)

  module.exports = {
    uploadToken
  }