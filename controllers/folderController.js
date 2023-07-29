const folderService = require('../services/folderService');

const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    const { userId } = req.user; 


    const existingFolder = await folderService.findFolderByNameAndUser(folderName, userId);
    if (existingFolder) {
      return res.status(409).json({ error: 'Folder with this name already exists' });
    }

    const newFolder = await folderService.createFolder(folderName, userId);

    return res.status(201).json({ message: 'Folder created successfully', folder: newFolder });
  } catch (err) {
    console.error('Error in createFolder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createSubfolder = async (req, res) => {
  try {
    const { parentFolderId, subfolderName } = req.body;
    const { userId } = req.user; 


    const parentFolder = await folderService.findFolderByIdAndUser(parentFolderId, userId);
    if (!parentFolder) {
      return res.status(404).json({ error: 'Parent folder not found' });
    }

    const existingSubfolder = await folderService.findSubfolderByNameAndParent(subfolderName, parentFolderId);
    if (existingSubfolder) {
      return res.status(409).json({ error: 'Subfolder with this name already exists under the parent folder' });
    }

    const newSubfolder = await folderService.createSubfolder(subfolderName, parentFolderId, userId);

    return res.status(201).json({ message: 'Subfolder created successfully', folder: newSubfolder });
  } catch (err) {
    console.error('Error in createSubfolder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const renameFolder = async (req, res) => {
  try {
    const { folderId, newName } = req.body;
    const { userId } = req.user; 

    const folder = await folderService.findFolderByIdAndUser(folderId, userId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const updatedFolder = await folderService.renameFolder(folderId, newName);

    return res.status(200).json({ message: 'Folder renamed successfully', folder: updatedFolder });
  } catch (err) {
    console.error('Error in renameFolder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.body;
    const { userId } = req.user; 

    const folder = await folderService.findFolderByIdAndUser(folderId, userId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    await folderService.deleteFolderRecursively(folderId, userId);

    return res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (err) {
    console.error('Error in deleteFolder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createFolder, createSubfolder, renameFolder, deleteFolder };
