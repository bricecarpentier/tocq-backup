const AWS = require('aws-sdk');
const s3UploadStream = require('s3-upload-stream');


const s3Destination = ({ s3options }, bucketName) => (keyName) => {
  const s3 = (new AWS.S3(s3options));
  const stream = s3UploadStream(s3);
  const uploadOptions = { Bucket: bucketName, Key: keyName };
  const upload = stream.upload(uploadOptions);
  return upload;
};


module.exports = s3Destination;
