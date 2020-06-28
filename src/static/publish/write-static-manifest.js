let { existsSync, readFileSync } = require('fs')
let { join } = require('path')
let { fingerprint: fingerprinter } = require('@architect/utils')

/**
 * Write, reuse, or possibly remove fingerprinted static asset manifest
 */
module.exports = function maybeWriteStaticManifest (params, callback) {
  let { fingerprint, ignore, isFullDeploy, publicDir } = params

  let staticFile = join(publicDir, 'static.json')
  let staticFileExists = existsSync(staticFile)
  let useExistingStaticManifest = isFullDeploy && fingerprint && staticFileExists

  // Assumes static manifest was already written to disk by deploy
  if (useExistingStaticManifest) {
    let manifest = JSON.parse(readFileSync(staticFile))
    callback(null, manifest)
  }
  // Let the fingerprinter sort out writing the manifest
  else {
    fingerprinter({ fingerprint, ignore }, callback)
  }
}
