const express = require('express');
const router = express.Router();
const { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, toggleLike, toggleSave, getComments, addComment } = require('../controllers/recipeController');
const { protect, creator } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getRecipes)
  .post(protect, creator, createRecipe);

router.route('/:id')
  .get(getRecipeById)
  .put(protect, creator, updateRecipe)
  .delete(protect, creator, deleteRecipe);

// Like & Save (any logged-in user)
router.post('/:id/like', protect, toggleLike);
router.post('/:id/save', protect, toggleSave);

// Comments
router.route('/:id/comments')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;
