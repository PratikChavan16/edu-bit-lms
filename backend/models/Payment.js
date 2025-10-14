const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  paymentMode: {
    type: String,
    enum: ['cash', 'online', 'cheque', 'card', 'upi'],
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String,
    default: null
  },
  chequeNumber: {
    type: String,
    default: null
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

// Auto-generate receipt number before validation
paymentSchema.pre('validate', async function(next) {
  if (!this.receiptNumber) {
    try {
      const Payment = mongoose.model('Payment');
      const count = await Payment.countDocuments();
      this.receiptNumber = `RCP${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating receipt number:', error);
    }
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
