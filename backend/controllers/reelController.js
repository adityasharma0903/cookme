const Reel = require('../models/Reel');

// @desc    Get all reels
// @route   GET /api/reels
// @access  Public
const getReels = async (req, res) => {
  const reels = await Reel.find({}).populate('creator', 'name avatar isVerified');
  res.json(reels);
};

// @desc    Create a reel
// @route   POST /api/reels
// @access  Private/Creator
const createReel = async (req, res) => {
  const reel = new Reel({
    creator: req.user._id,
    ...req.body
  });
  const createdReel = await reel.save();
  res.status(201).json(createdReel);
};

// @desc    Delete a reel
// @route   DELETE /api/reels/:id
// @access  Private/Creator
const deleteReel = async (req, res) => {
  const reel = await Reel.findById(req.params.id);

  if (reel) {
    if (reel.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this reel' });
    }
    await reel.deleteOne();
    res.json({ message: 'Reel removed' });
  } else {
    res.status(404).json({ message: 'Reel not found' });
  }
};

module.exports = { getReels, createReel, deleteReel };
