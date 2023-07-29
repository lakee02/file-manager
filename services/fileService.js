const AWS = require('aws-sdk');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid'); // Used to generate unique file names
const path = require('path');


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const s3 = new AWS.S3();

const uploadFileToS3 = async (file, folderId) => {
  try {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folderId}/${uniqueFileName}`, 
      Body: file.buffer,
      ACL: 'public-read', 
    };

    const uploadedObject = await s3.upload(params).promise();

    return {
      url: uploadedObject.Location,
      key: uploadedObject.Key,
      size: file.size,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const createFile = async (fileData) => {
  try {
    const { url, key, size, folderId, ownerId } = fileData;

    
    const newFile = new File({
      url,
      key,
      size,
      folderId,
      ownerId,
    });

    await newFile.save();

    return newFile;
  } catch (err) {
    throw new Error(err.message);
  }
};

const renameFile = async (fileId, newName) => {
  try {
    
    const file = await File.findById(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    
    file.name = newName;
    await file.save();

    return file;
  } catch (err) {
    throw new Error(err.message);
  }
};

const moveFile = async (fileId, newFolderId) => {
  try {
   
    const file = await File.findById(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    
    file.folderId = newFolderId;
    await file.save();

    return file;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteFileFromS3 = async (file) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.key,
    };

    await s3.deleteObject(params).promise();
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteFile = async (fileId) => {
  try {
    
    const file = await File.findById(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    
    await deleteFileFromS3(file);

    
    await file.remove();
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { uploadFileToS3, createFile, renameFile, moveFile, deleteFile };
