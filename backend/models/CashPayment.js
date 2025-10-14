const mongoose = require('mongoose');

// CashPayment model is for EXTRA cash charges that students pay
// These are NOT part of tuition fees and are tracked separately
// Examples: Library fines, lab fees, exam fees, hostel charges, etc.
const cashPaymentSchema = new mongoose.Schema({
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
    default: 'Miscellaneous'
  },
  category: {
    type: String,
    enum: ['Library Fine', 'Lab Fee', 'Exam Fee', 'Transportation', 'Hostel', 'Miscellaneous', 'Sports', 'Books', 'Other'],
    default: 'Miscellaneous'
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

module.exports = mongoose.model('CashPayment', cashPaymentSchema);
