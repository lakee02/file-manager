const fileService = require('../services/fileService');

const uploadFile = async (req, res) => {
  try {
    const { folderId } = req.body;
    const file = req.file; 

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = await fileService.findFolderById(folderId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const fileData = await fileService.uploadFileToS3(file, folderId);

    const newFile = await fileService.createFile(fileData);

    return res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (err) {
    console.error('Error in uploadFile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const renameFile = async (req, res) => {
  try {
    const { fileId, newName } = req.body;

    const file = await fileService.findFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const updatedFile = await fileService.renameFile(fileId, newName);

    return res.status(200).json({ message: 'File renamed successfully', file: updatedFile });
  } catch (err) {
    console.error('Error in renameFile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const moveFile = async (req, res) => {
  try {
    const { fileId, newFolderId } = req.body;

    const file = await fileService.findFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const newFolder = await fileService.findFolderById(newFolderId);
    if (!newFolder) {
      return res.status(404).json({ error: 'New folder not found' });
    }

    const movedFile = await fileService.moveFile(fileId, newFolderId);

    return res.status(200).json({ message: 'File moved successfully', file: movedFile });
  } catch (err) {
    console.error('Error in moveFile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    const file = await fileService.findFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    await fileService.deleteFileFromS3(file);

    await fileService.deleteFile(fileId);

    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Error in deleteFile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { uploadFile, renameFile, moveFile, deleteFile };
