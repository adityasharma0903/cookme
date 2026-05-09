const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    res.json({
      message: 'Image Uploaded Successfully',
      imageUrl: req.file.path,
    });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
});

router.post('/video', protect, upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }
    res.json({
      message: 'Video Uploaded Successfully',
      videoUrl: req.file.path,
    });
  } catch (err) {
    console.error('Video upload error:', err);
    res.status(500).json({ message: 'Video upload failed', error: err.message });
  }
});

module.exports = router;
