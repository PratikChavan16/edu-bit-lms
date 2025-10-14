const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Payment = require('../models/Payment');
const MiscellaneousCharge = require('../models/MiscellaneousCharge');
const Course = require('../models/Course');
const { authMiddleware } = require('../middleware/auth');

// Configure multer for file upload
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Upload CSV and import students
router.post('/upload-csv', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const students = [];
    const errors = [];
    let rowNumber = 0;

    // Parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        rowNumber++;
        try {
          // Map CSV columns to student schema
          const student = {
            enrollmentNumber: row.enrollmentNumber || row.enrollment_number || row['Enrollment Number'],
            firstName: row.firstName || row.first_name || row['First Name'],
            lastName: row.lastName || row.last_name || row['Last Name'],
            email: row.email || row.Email,
            phone: row.phone || row.Phone,
            course: row.course || row.Course,
            batch: row.batch || row.Batch,
            admissionDate: new Date(row.admissionDate || row.admission_date || row['Admission Date']),
            totalFees: parseFloat(row.totalFees || row.total_fees || row['Total Fees'] || 0),
            paidFees: parseFloat(row.paidFees || row.paid_fees || row['Paid Fees'] || 0),
            address: row.address || row.Address || '',
            parentName: row.parentName || row.parent_name || row['Parent Name'] || '',
            parentPhone: row.parentPhone || row.parent_phone || row['Parent Phone'] || ''
          };

          // Basic validation
          if (!student.enrollmentNumber || !student.firstName || !student.lastName || !student.email) {
            errors.push({ row: rowNumber, message: 'Missing required fields' });
          } else {
            students.push(student);
          }
        } catch (error) {
          errors.push({ row: rowNumber, message: error.message });
        }
      })
      .on('end', async () => {
        try {
          const results = {
            total: students.length,
            inserted: 0,
            updated: 0,
            errors: errors
          };

          // Insert or update students
          for (const studentData of students) {
            try {
              const existing = await Student.findOne({ enrollmentNumber: studentData.enrollmentNumber });
              
              if (existing) {
                await Student.updateOne({ enrollmentNumber: studentData.enrollmentNumber }, studentData);
                results.updated++;
              } else {
                const newStudent = new Student(studentData);
                await newStudent.save();
                results.inserted++;
              }
            } catch (error) {
              results.errors.push({ 
                enrollmentNumber: studentData.enrollmentNumber, 
                message: error.message 
              });
            }
          }

          // Delete uploaded file
          fs.unlinkSync(req.file.path);

          res.json({
            message: 'CSV processing completed',
            results
          });
        } catch (error) {
          console.error('CSV processing error:', error);
          res.status(500).json({ message: 'Error processing CSV data' });
        }
      });
  } catch (error) {
    console.error('CSV upload error:', error);
    res.status(500).json({ message: 'Server error during CSV upload' });
  }
});

// Get filter options
router.get('/filters/options', authMiddleware, async (req, res) => {
  try {
    const departments = await Student.distinct('department');
    const batches = await Student.distinct('batch');
    const courses = await Student.distinct('course');
    const statuses = ['active', 'graduated', 'dropped'];
    const genders = ['Male', 'Female', 'Other'];
    const paymentStatuses = [
      { value: 'paid', label: 'Fully Paid' },
      { value: 'partial', label: 'Partially Paid' },
      { value: 'pending', label: 'No Payment' }
    ];

    res.json({
      departments,
      batches,
      courses,
      statuses,
      genders,
      paymentStatuses
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students with pagination and filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      course = '', 
      batch = '', 
      status = '',
      department = '',
      gender = '',
      paymentStatus = '' // 'paid', 'partial', 'pending'
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { enrollmentNumber: new RegExp(search, 'i') },
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    // Additional filters
    if (course) query.course = new RegExp(course, 'i');
    if (batch) query.batch = batch;
    if (status) query.status = status;
    if (department) query.department = department;
    if (gender) query.gender = gender;

    // Payment status filter
    if (paymentStatus) {
      if (paymentStatus === 'paid') {
        query.pendingFees = 0;
      } else if (paymentStatus === 'pending') {
        query.pendingFees = { $gt: 0 };
        query.paidFees = 0;
      } else if (paymentStatus === 'partial') {
        query.pendingFees = { $gt: 0 };
        query.paidFees = { $gt: 0 };
      }
    }

    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single student by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get payment history
    const payments = await Payment.find({ student: req.params.id }).sort({ paymentDate: -1 });

    res.json({ student, payments });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by name and auto-fill fees
router.get('/course-fees/:courseName', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findOne({ courseName: req.params.courseName });
    if (course) {
      return res.json({ defaultFees: course.defaultFees, courseId: course._id });
    }
    res.json({ defaultFees: null });
  } catch (error) {
    console.error('Get course fees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new student manually
router.post('/', authMiddleware, [
  body('enrollmentNumber').trim().notEmpty(),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('email').isEmail(),
  body('phone').trim().notEmpty(),
  body('course').trim().notEmpty(),
  body('batch').trim().notEmpty(),
  body('admissionDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if enrollment number already exists
    const existing = await Student.findOne({ enrollmentNumber: req.body.enrollmentNumber });
    if (existing) {
      return res.status(400).json({ message: 'Student with this enrollment number already exists' });
    }

    let studentData = { ...req.body };

    // Auto-fill fees from course if not manually overridden
    if (!req.body.feesOverridden) {
      const course = await Course.findOne({ courseName: req.body.course });
      if (course) {
        studentData.totalFees = req.body.totalFees || course.defaultFees;
        studentData.courseRef = course._id;
      }
    }

    const student = new Student(studentData);
    await student.save();

    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Also delete associated payments
    await Payment.deleteMany({ student: req.params.id });
    await MiscellaneousCharge.deleteMany({ student: req.params.id });

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unique courses and batches for filters
router.get('/filters/options', authMiddleware, async (req, res) => {
  try {
    const courses = await Student.distinct('course');
    const batches = await Student.distinct('batch');

    res.json({ courses, batches });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
