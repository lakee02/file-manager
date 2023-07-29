const express = require('express');
const folderController = require('../controllers/folderController');

const router = express.Router();

router.post('/create', folderController.createFolder);
router.post('/createSubfolder', folderController.createSubfolder);
router.put('/rename', folderController.renameFolder);
router.delete('/delete', folderController.deleteFolder);

module.exports = router;
