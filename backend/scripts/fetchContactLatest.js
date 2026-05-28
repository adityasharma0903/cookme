require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const ContactMessage = require('../models/ContactMessage');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const msg = await ContactMessage.findOne().sort({ createdAt: -1 }).lean();
    console.log('Latest contact message:');
    console.dir(msg, { depth: null });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
