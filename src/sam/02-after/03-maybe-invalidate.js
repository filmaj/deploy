let parallel = require('run-parallel')
let aws = require('aws-sdk')

let list = require('./00-get-app-apex/cloudfront-list')

module.exports = function maybeInvalidateDists({arc, stackname, stage}, callback) {
  // Allow users to disable Architect's CDN checks so they can configure / manage their own via Macros
  let cdn = arc.cdn && arc.cdn[0]
  let cdnBypass = cdn === false || cdn === 'disable' || cdn === 'disabled'
  if (cdnBypass) {
    callback()
  }
  else {
    // read the cloudformation stack to get the s3 and apigateway urls
    parallel({
      cfn(callback) {
        let cloudformation = new aws.CloudFormation({region: process.env.AWS_REGION})
        cloudformation.describeStacks({
          StackName: stackname
        }, callback)
      },
      cf(callback) {
        list(callback)
      }
    },
    function done(err, {cfn, cf}) {
      if (err) callback(err)
      else {
        // find matching distributions in cloudfront
        let outs = cfn.Stacks[0].Outputs
        let api = o=> o.OutputKey === 'API'
        let bucket = o=> o.OutputKey === 'BucketURL'

        let apigateway = cf.find(function findDistro(distro) {
          let origin = outs.find(api)
          if (!origin) return false
          let dist = distro.origin
          let orig = origin.OutputValue.replace(`/${stage}`, '').replace('http://', '').replace('https://', '')
          return dist === orig
        }) || false

        let s3 = cf.find(function findDistro(distro) {
          let origin = outs.find(bucket)
          if (!origin) return false
          let dist = distro.origin
          let orig = origin.OutputValue.replace(`/${stage}`, '').replace('http://', '').replace('https://', '')
          return dist === orig
        }) || false

        if (apigateway || s3) {
          // invalidate said dists at /*
          let cloudfront = new aws.CloudFront
          parallel({
            apigdist(callback) {
              if (apigateway) {
                cloudfront.createInvalidation({
                  DistributionId: apigateway.id,
                  InvalidationBatch: {
                    CallerReference: Date.now()+'',
                    Paths: {
                      Quantity: '1',
                      Items: ['/*']
                    }
                  }
                }, callback)
              }
              else {
                callback()
              }
            },
            s3dist(callback) {
              if (s3) {
                cloudfront.createInvalidation({
                  DistributionId: s3.id,
                  InvalidationBatch: {
                    CallerReference: Date.now()+'',
                    Paths: {
                      Quantity: '1',
                      Items: ['/*']
                    }
                  }
                }, callback)
              }
              else {
                callback()
              }

            }
          },
          function done(err) {
            if (err) callback(err)
            else callback()
          })
        }
        else {
          callback()
        }
      }
    })
  }
}
