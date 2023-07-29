const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', fileController.uploadFile);
router.put('/rename', fileController.renameFile);
router.put('/move', fileController.moveFile);
router.delete('/delete', fileController.deleteFile);

module.exports = router;
