'use strict';

const AWS = require('aws-sdk');
const sharp = require('sharp');
const S3 = new AWS.S3();

module.exports.handle = async ({ Records: records }, context) => {
  try {
    await Promise.all(records.map(async record => {
      const { key } = record.s3.object;

      const image = await S3.getObject({
        Bucket: process.env.buckect,
        Key: key
      }).promise();

      const optimized = await sharp(image.Body)
        .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
        .toFormat('jpeg', { progressive: true, quality: 50 })
        .toBuffer()

    }));

    return {
      statusCode: 301,
      body: {}
    };
  } catch (err) {
    return err;
  }
};
