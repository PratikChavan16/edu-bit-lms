const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');

// Load environment variables
dotenv.config();

const dummyCourses = [
  {
    courseName: 'B.Tech Computer Science',
    courseCode: 'BTCS',
    duration: '4 Years',
    defaultFees: 500000,
    description: 'Bachelor of Technology in Computer Science and Engineering'
  },
  {
    courseName: 'B.Tech Information Technology',
    courseCode: 'BTIT',
    duration: '4 Years',
    defaultFees: 450000,
    description: 'Bachelor of Technology in Information Technology'
  },
  {
    courseName: 'B.Tech Electronics',
    courseCode: 'BTEC',
    duration: '4 Years',
    defaultFees: 480000,
    description: 'Bachelor of Technology in Electronics and Communication Engineering'
  },
  {
    courseName: 'B.Tech Mechanical',
    courseCode: 'BTME',
    duration: '4 Years',
    defaultFees: 470000,
    description: 'Bachelor of Technology in Mechanical Engineering'
  },
  {
    courseName: 'B.Tech Civil',
    courseCode: 'BTCE',
    duration: '4 Years',
    defaultFees: 460000,
    description: 'Bachelor of Technology in Civil Engineering'
  },
  {
    courseName: 'BBA',
    courseCode: 'BBA',
    duration: '3 Years',
    defaultFees: 300000,
    description: 'Bachelor of Business Administration'
  },
  {
    courseName: 'BCA',
    courseCode: 'BCA',
    duration: '3 Years',
    defaultFees: 350000,
    description: 'Bachelor of Computer Applications'
  },
  {
    courseName: 'B.Com',
    courseCode: 'BCOM',
    duration: '3 Years',
    defaultFees: 280000,
    description: 'Bachelor of Commerce'
  },
  {
    courseName: 'MBA',
    courseCode: 'MBA',
    duration: '2 Years',
    defaultFees: 600000,
    description: 'Master of Business Administration'
  },
  {
    courseName: 'M.Tech Computer Science',
    courseCode: 'MTCS',
    duration: '2 Years',
    defaultFees: 550000,
    description: 'Master of Technology in Computer Science'
  }
];

const populateCourses = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sai_lms_fees');
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert dummy courses
    await Course.insertMany(dummyCourses);
    console.log('✅ Successfully populated courses!');
    console.log(`Added ${dummyCourses.length} courses:\n`);
    
    dummyCourses.forEach(course => {
      console.log(`- ${course.courseName} (${course.courseCode}) - ₹${course.defaultFees.toLocaleString()}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error populating courses:', error);
    process.exit(1);
  }
};

populateCourses();
