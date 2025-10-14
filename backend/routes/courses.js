const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Student = require('../models/Student');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get all courses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ courseName: 1 });
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single course
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new course (Admin only)
router.post('/', authMiddleware, adminOnly, [
  body('courseName').trim().notEmpty(),
  body('courseCode').trim().notEmpty(),
  body('duration').trim().notEmpty(),
  body('defaultFees').isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseName, courseCode, duration, defaultFees, description } = req.body;

    // Check if course already exists
    const existing = await Course.findOne({ $or: [{ courseName }, { courseCode }] });
    if (existing) {
      return res.status(400).json({ message: 'Course already exists' });
    }

    const course = new Course({
      courseName,
      courseCode,
      duration,
      defaultFees,
      description
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course (Admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course (Admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    // Check if any students are enrolled in this course
    const studentsCount = await Student.countDocuments({ courseRef: req.params.id });
    if (studentsCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete course. ${studentsCount} students are enrolled in this course.` 
      });
    }

    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
