let reads = require('./reads')
let series = require('run-series')
let create = require('./cloudfront-create')
let destroy = require('./cloudfront-destroy')

module.exports = function getAppApex({ts, arc, pretty, stackname}, callback) {
  pretty.success(ts)
  reads({
    stackname
  },
  function done(err, {url, s3, apigateway}) {
    if (err) {
      console.log(err)
      callback()
    }
    else {
      if (arc.cdn && apigateway && apigateway.status != 'InProgress') {
        pretty.url(`https://${apigateway.domain}`)
      }
      else if (arc.cdn && s3 && s3.status != 'InProgress') {
        pretty.url(`https://${s3.domain}`)
      }
      else if (url) {
        pretty.url(url)
      }

      // create cdns if cdn is defined
      let creatingS3 = arc.static && arc.cdn && s3 === false
      let creatingApiGateway = arc.http && arc.cdn && apigateway === false

      // destroy (to the best of our ability) cdns if cdn is not defined
      let destroyingS3 = typeof arc.cdn === 'undefined'
      let destroyingApiGateway = typeof arc.cdn === 'undefined'

      series([
        function createS3(callback) {
          let domain = url.replace('http://', '').replace('https://', '')
          if (creatingS3)
            create({domain}, callback)
          else
            callback()
        },
        function destroyS3(callback) {
          if (destroyingS3)
            destroy(s3, callback)
          else
            callback()
        },
        function createApiGateway(callback) {
          let domain = url.replace('/production/', '').replace('https://', '')
          let path = '/production'
          if (creatingApiGateway)
            create({domain, path}, callback)
          else
            callback()
        },
        function destroyApiGateway(callback) {
          if (destroyingApiGateway)
            destroy(apigateway, callback)
          else
            callback()
        },
      ],
      function done(err) {
        if (err) callback(err)
        else callback()
      })

    }
  })
}
