const User = require('../models/User');

// @desc    Get all creators
// @route   GET /api/users/creators
// @access  Public
const getCreators = async (req, res) => {
  const creators = await User.find({ role: 'creator' }).select('-password');
  res.json(creators);
};

// @desc    Get creator by ID
// @route   GET /api/users/creators/:id
// @access  Public
const getCreatorById = async (req, res) => {
  const creator = await User.findById(req.params.id).select('-password');
  if (creator && creator.role === 'creator') {
    res.json(creator);
  } else {
    res.status(404).json({ message: 'Creator not found' });
  }
};

// @desc    Create a new creator
// @route   POST /api/users/creators
// @access  Private/Admin
const createCreator = async (req, res) => {
  const { name, email, password, specialty, bio, avatar, username } = req.body;
  // Check email or username uniqueness
  const userExists = await User.findOne({ $or: [ { email }, { username } ] });

  if (userExists) {
    return res.status(400).json({ message: 'Email or username already exists' });
  }

  const user = await User.create({
    name, email, password, username, role: 'creator', specialty, bio, avatar
  });

  if (user) {
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Update creator profile
// @route   PUT /api/users/creators/:id
// @access  Private (Admin or Creator themselves)
const updateCreator = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.specialty = req.body.specialty || user.specialty;
    user.avatar = req.body.avatar || user.avatar;
    // username update with uniqueness check
    if (req.body.username && req.body.username !== user.username) {
      const existing = await User.findOne({ username: req.body.username });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = req.body.username;
    }
    user.socialLinks = req.body.socialLinks || user.socialLinks;
    if (req.user.role === 'admin') {
      user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : user.isVerified;
      user.status = req.body.status || user.status;
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Delete creator
// @route   DELETE /api/users/creators/:id
// @access  Private/Admin
const deleteCreator = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user && user.role === 'creator') {
    await user.deleteOne();
    res.json({ message: 'Creator removed' });
  } else {
    res.status(404).json({ message: 'Creator not found' });
  }
};

// @desc    Update Password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user && (await user.matchPassword(req.body.oldPassword))) {
    user.password = req.body.newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } else {
    res.status(401).json({ message: 'Invalid old password' });
  }
};

// @desc    Follow / Unfollow user
// @route   POST /api/users/:id/follow
// @access  Private
const toggleFollow = async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!targetUser || !currentUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (targetUser._id.toString() === currentUser._id.toString()) {
    return res.status(400).json({ message: 'You cannot follow yourself' });
  }

  const isFollowing = currentUser.following.includes(targetUser._id);

  if (isFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUser._id.toString());
    targetUser.followersList = targetUser.followersList.filter(id => id.toString() !== currentUser._id.toString());
    targetUser.followers = Math.max(0, targetUser.followers - 1);
  } else {
    // Follow
    currentUser.following.push(targetUser._id);
    targetUser.followersList.push(currentUser._id);
    targetUser.followers += 1;
  }

  await currentUser.save();
  await targetUser.save();

  res.json({ isFollowing: !isFollowing, followers: targetUser.followers });
};

module.exports = { getCreators, getCreatorById, createCreator, updateCreator, deleteCreator, updatePassword, toggleFollow };
