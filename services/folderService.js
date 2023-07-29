const Folder = require('../models/folder');

const createFolder = async (folderData) => {
  try {
    const { folderName, ownerId } = folderData;

    
    const existingFolder = await Folder.findOne({ name: folderName, ownerId });
    if (existingFolder) {
      throw new Error('Folder with this name already exists');
    }

    const newFolder = new Folder({
      name: folderName,
      ownerId,
    });

    await newFolder.save();

    return newFolder;
  } catch (err) {
    throw new Error(err.message);
  }
};

const createSubfolder = async (parentId, folderData) => {
  try {
    const { folderName, ownerId } = folderData;

    const parentFolder = await Folder.findById(parentId);
    if (!parentFolder) {
      throw new Error('Parent folder not found');
    }

    const existingSubfolder = await Folder.findOne({ name: folderName, parentId });
    if (existingSubfolder) {
      throw new Error('Subfolder with this name already exists under the parent folder');
    }

    const newSubfolder = new Folder({
      name: folderName,
      parentId,
      ownerId,
    });

    await newSubfolder.save();

    return newSubfolder;
  } catch (err) {
    throw new Error(err.message);
  }
};

const renameFolder = async (folderId, newName) => {
  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      throw new Error('Folder not found');
    }

    folder.name = newName;
    await folder.save();

    return folder;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteFolderRecursively = async (folderId, ownerId) => {
  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      throw new Error('Folder not found');
    }

    if (folder.ownerId.toString() !== ownerId) {
      throw new Error('Folder does not belong to the owner');
    }

    const subfolders = await Folder.find({ parentId: folderId });

    for (const subfolder of subfolders) {
      await deleteFolderRecursively(subfolder._id, ownerId);
    }

    await folder.remove();
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteFolder = async (folderId, ownerId) => {
  try {
    await deleteFolderRecursively(folderId, ownerId);
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { createFolder, createSubfolder, renameFolder, deleteFolder };
