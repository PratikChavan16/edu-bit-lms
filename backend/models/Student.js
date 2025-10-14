const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  courseRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  department: {
    type: String,
    enum: ['Engineering', 'Management', 'Commerce', 'Computer Applications', 'Science', 'Other'],
    default: 'Other'
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
    default: 'Male'
  },
  batch: {
    type: String,
    required: true
  },
  feesOverridden: {
    type: Boolean,
    default: false
  },
  admissionDate: {
    type: Date,
    required: true
  },
  totalFees: {
    type: Number,
    required: true,
    default: 0
  },
  paidFees: {
    type: Number,
    default: 0
  },
  pendingFees: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'graduated', 'dropped'],
    default: 'active'
  },
  address: {
    type: String
  },
  parentName: {
    type: String
  },
  parentPhone: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate pending fees before saving
studentSchema.pre('save', function(next) {
  this.pendingFees = this.totalFees - this.paidFees;
  next();
});

module.exports = mongoose.model('Student', studentSchema);
