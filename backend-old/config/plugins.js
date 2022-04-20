module.exports = ({ env }) => ({
  graphql: {
    "endpoint": "/graphql",
    "shadowCRUD": true,
    "playgroundAlways": true,
    "depthLimit": 7,
    apolloServer: {
      "tracing": false,
      "amountLimit": 100,
    },
  },
  upload: {
    "provider": "aws-s3",
    "providerOptions": {
      "accessKeyId": env('AWS_ACCESS_KEY_ID', ''),
      "secretAccessKey": env('AWS_SECRET_ACCESS_KEY', ''),
      "region": "eu-central-1",
      "params": {
        "Bucket": env('AWS_BUCKET_NAME', ''),
      }
    },
  }
});
