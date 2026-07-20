const express = require('express');
const router = express.Router();
const { getAssets, createAsset, deleteAsset } = require('../controllers/assetController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAssets);
router.post('/', protect, createAsset);
router.delete('/:id', protect, deleteAsset);

module.exports = router;
