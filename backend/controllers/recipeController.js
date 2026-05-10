const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const User = require('../models/User');

const allowedCategories = [
  'Drinks & Mocktails',
  'Fast Food & Snacks',
  'Salads & Healthy Recipes',
  'Desserts & Sweet Treats'
];

const validateCategory = (category) => allowedCategories.includes(category);

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
  const recipes = await Recipe.find({}).populate('creator', 'name avatar isVerified specialty');
  res.json(recipes);
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate('creator', 'name avatar isVerified specialty');
  if (recipe) {
    // Increment views
    recipe.views = (recipe.views || 0) + 1;
    await recipe.save();
    res.json(recipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private/Creator
const createRecipe = async (req, res) => {
  if (req.body.category && !validateCategory(req.body.category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  const recipe = new Recipe({
    creator: req.user._id,
    ...req.body
  });
  const createdRecipe = await recipe.save();
  res.status(201).json(createdRecipe);
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private/Creator
const updateRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    if (recipe.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to edit this recipe' });
    }
    if (req.body.category && !validateCategory(req.body.category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    Object.assign(recipe, req.body);
    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private/Creator
const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    if (recipe.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this recipe' });
    }
    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
};

// @desc    Toggle like on recipe
// @route   POST /api/recipes/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  const userId = req.user._id;
  const alreadyLiked = recipe.likedBy.some(id => id.toString() === userId.toString());

  if (alreadyLiked) {
    recipe.likedBy = recipe.likedBy.filter(id => id.toString() !== userId.toString());
    recipe.likes = Math.max(0, recipe.likes - 1);
    // Also remove from user's likedRecipes
    await User.findByIdAndUpdate(userId, { $pull: { likedRecipes: recipe._id } });
  } else {
    recipe.likedBy.push(userId);
    recipe.likes += 1;
    await User.findByIdAndUpdate(userId, { $addToSet: { likedRecipes: recipe._id } });
  }

  await recipe.save();
  res.json({ liked: !alreadyLiked, likes: recipe.likes });
};

// @desc    Toggle save on recipe
// @route   POST /api/recipes/:id/save
// @access  Private
const toggleSave = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  const userId = req.user._id;
  const alreadySaved = recipe.savedBy.some(id => id.toString() === userId.toString());

  if (alreadySaved) {
    recipe.savedBy = recipe.savedBy.filter(id => id.toString() !== userId.toString());
    recipe.saves = Math.max(0, recipe.saves - 1);
    await User.findByIdAndUpdate(userId, { $pull: { savedRecipes: recipe._id } });
  } else {
    recipe.savedBy.push(userId);
    recipe.saves += 1;
    await User.findByIdAndUpdate(userId, { $addToSet: { savedRecipes: recipe._id } });
  }

  await recipe.save();
  res.json({ saved: !alreadySaved, saves: recipe.saves });
};

// @desc    Get comments for a recipe
// @route   GET /api/recipes/:id/comments
// @access  Public
const getComments = async (req, res) => {
  const comments = await Comment.find({ recipe: req.params.id })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(comments);
};

// @desc    Add comment to recipe
// @route   POST /api/recipes/:id/comments
// @access  Private
const addComment = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  const comment = await Comment.create({
    recipe: req.params.id,
    user: req.user._id,
    text: req.body.text,
  });

  recipe.comments = (recipe.comments || 0) + 1;
  await recipe.save();

  const populated = await Comment.findById(comment._id).populate('user', 'name avatar');
  res.status(201).json(populated);
};

module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, toggleLike, toggleSave, getComments, addComment };

