if (process.env.NODE_ENV === 'production') {
  module.exports = {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-central-1',
      params: {
        Bucket: process.env.AWS_BUCKET_NAME
      }
    }
  };
} else {
  // to use the default local provider you can return an empty configuration
  module.exports = {};
}
