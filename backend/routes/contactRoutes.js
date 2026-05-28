const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { createContactMessage, getContactMessages } = require('../controllers/contactController');

router.route('/')
  .post(createContactMessage)
  .get(protect, admin, getContactMessages);

module.exports = router;