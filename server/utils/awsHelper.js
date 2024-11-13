import AWS from 'aws-sdk';
import s3 from '../config/aws.js';

class AWSHelper {
  static generatePresignedUrl (bucketName, fileKey, expiresIn=60) {
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Expires: expiresIn
    };

    return s3.getSignedUrl('getObject', params);
  }

  static async uploadFileToS3 (fileContent, fileName) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ACL: 'private'
    };

    return s3.upload(params).promise();
  }

  static async downloadFileFromS3 (fileName) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName
    };

    return s3.getObject(params).promise();
  }

  static async deleteFileFromS3 (fileName) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName
    };

    return s3.deleteObject(params).promise();
  }
}

export default AWSHelper;
