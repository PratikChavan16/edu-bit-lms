const mongoose = require('mongoose');

// MiscellaneousCharge model is for EXTRA charges that students pay
// These are NOT part of tuition fees and are tracked separately
// Examples: Library fines, lab fees, exam fees, stationery, ID card, etc.
const miscellaneousChargeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  enrollmentNumber: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  purpose: {
    type: String,
    required: true,
    default: 'General'
  },
  category: {
    type: String,
    enum: ['Library Fine', 'Lab Fee', 'Exam Fee', 'ID Card', 'Stationery', 'Certificate', 'Late Fee', 'Other'],
    default: 'Other'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordedByName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MiscellaneousCharge', miscellaneousChargeSchema);
