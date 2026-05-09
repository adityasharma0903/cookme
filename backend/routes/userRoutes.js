const express = require('express');
const router = express.Router();
const { getCreators, getCreatorById, createCreator, updateCreator, deleteCreator, updatePassword, toggleFollow } = require('../controllers/userController');
const { protect, admin, creator } = require('../middlewares/authMiddleware');

router.route('/creators')
  .get(getCreators)
  .post(protect, admin, createCreator);

router.route('/creators/:id')
  .get(getCreatorById)
  .put(protect, updateCreator)
  .delete(protect, admin, deleteCreator);

router.put('/password', protect, updatePassword);
router.post('/:id/follow', protect, toggleFollow);

module.exports = router;
