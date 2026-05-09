const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@cookwithkaju.com' });
    
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const adminUser = new User({
      name: 'Main Admin',
      email: 'admin@cookwithkaju.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();
    console.log('Admin created successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
