const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sai_lms_fees');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      username: 'admin',
      email: 'admin@saigroup.edu',
      password: hashedPassword,
      role: 'admin',
      fullName: 'System Administrator',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');

    // Create sample accountant user
    const accountantPassword = await bcrypt.hash('accountant123', 10);
    
    const accountant = new User({
      username: 'accountant',
      email: 'accountant@saigroup.edu',
      password: accountantPassword,
      role: 'accountant',
      fullName: 'Sample Accountant',
      isActive: true
    });

    await accountant.save();
    console.log('\n✅ Accountant user created successfully!');
    console.log('Username: accountant');
    console.log('Password: accountant123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
