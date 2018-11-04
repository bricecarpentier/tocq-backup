/* eslint-env jest */
const { Writeable } = require('stream');
const AWS = require('aws-sdk');
const s3UploadStream = require('s3-upload-stream');
const s3 = require('./s3');

jest.mock('s3-upload-stream');
jest.mock('aws-sdk');

beforeEach(() => {
  AWS.S3.mockClear();
  s3UploadStream.mockClear();
});


it('should return a stream uploading to the specified s3 bucket', () => {
  const S3 = Symbol('S3');
  const s3options = Symbol('s3options');
  const bucketName = Symbol('bucketName');
  const keyName = Symbol('keyName');
  const uploadStream = Symbol('uploaded');
  const upload = jest.fn().mockReturnValue(uploadStream);

  const uut = s3(s3options, bucketName);
  s3UploadStream.mockReturnValue({ upload });

  const ret = uut(keyName);
  expect(AWS.S3).toHaveBeenCalledWith(s3options);
  expect(upload).toHaveBeenCalledWith({ Bucket: bucketName, Key: keyName });
  expect(ret).toEqual({ stream: uploadStream });
});
