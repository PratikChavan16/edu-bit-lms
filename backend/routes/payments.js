const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const MiscellaneousCharge = require('../models/MiscellaneousCharge');
const Student = require('../models/Student');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Record new payment or miscellaneous charge
// Payment types:
// 1. Fee Payments (cash, online, cheque, card, upi) - Affects student balance
// 2. Miscellaneous Charges (separate) - Does NOT affect student balance
router.post('/', authMiddleware, [
  body('studentId').notEmpty(),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('paymentMode').isIn(['cash', 'online', 'cheque', 'card', 'upi', 'miscellaneous']),
  body('paymentDate').optional().isISO8601(),
  body('purpose').optional().isString(),
  body('category').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, amount, paymentMode, paymentDate, transactionId, chequeNumber, remarks } = req.body;

    // Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { purpose, category } = req.body;
    let paymentRecord;
    let feeUpdated = false;
    let isMiscCharge = false;

    // Handle MISCELLANEOUS CHARGES (Admin only, separate tracking)
    if (paymentMode === 'miscellaneous') {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can record miscellaneous charges' });
      }

      // Generate receipt number for miscellaneous charge
      const miscCount = await MiscellaneousCharge.countDocuments();
      const receiptNumber = `MISC${String(miscCount + 1).padStart(6, '0')}`;

      paymentRecord = new MiscellaneousCharge({
        student: studentId,
        enrollmentNumber: student.enrollmentNumber,
        studentName: `${student.firstName} ${student.lastName}`,
        amount: parseFloat(amount),
        purpose: purpose || 'General',
        category: category || 'Other',
        paymentDate: paymentDate || new Date(),
        remarks,
        receiptNumber,
        recordedBy: req.user._id,
        recordedByName: req.user.fullName
      });

      await paymentRecord.save();
      isMiscCharge = true;
      feeUpdated = false; // Misc charges DO NOT affect student fee balance
    } else {
      // Handle FEE PAYMENTS (cash, online, cheque, card, upi)
      // All of these affect student fee balance
      const paymentCount = await Payment.countDocuments();
      const receiptNumber = `FEE${String(paymentCount + 1).padStart(6, '0')}`;

      paymentRecord = new Payment({
        student: studentId,
        enrollmentNumber: student.enrollmentNumber,
        studentName: `${student.firstName} ${student.lastName}`,
        amount: parseFloat(amount),
        paymentMode,
        paymentDate: paymentDate || new Date(),
        transactionId,
        chequeNumber,
        remarks,
        receiptNumber,
        recordedBy: req.user._id,
        recordedByName: req.user.fullName
      });

      await paymentRecord.save();

      // Update student's paid fees for ALL fee payments (including cash)
      student.paidFees = (student.paidFees || 0) + parseFloat(amount);
      student.pendingFees = student.totalFees - student.paidFees;
      await student.save();
      feeUpdated = true;
    }

    res.status(201).json({ 
      message: isMiscCharge ? 'Miscellaneous charge recorded successfully' : 'Fee payment recorded successfully', 
      payment: paymentRecord,
      isMiscCharge,
      student: feeUpdated ? {
        paidFees: student.paidFees,
        pendingFees: student.pendingFees
      } : null
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all fee payments with comprehensive filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      paymentMode = '', 
      startDate = '',
      endDate = '',
      department = '',
      gender = '',
      batch = '',
      course = ''
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { enrollmentNumber: new RegExp(search, 'i') },
        { studentName: new RegExp(search, 'i') },
        { receiptNumber: new RegExp(search, 'i') }
      ];
    }

    // Payment mode filter
    if (paymentMode) {
      query.paymentMode = paymentMode;
    }

    // Date range filter
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    // Get payments and populate student for additional filters
    let payments = await Payment.find(query)
      .populate('student', 'enrollmentNumber firstName lastName course department gender batch')
      .sort({ paymentDate: -1 })
      .exec();

    // Apply student-based filters after population
    if (department || gender || batch || course) {
      payments = payments.filter(payment => {
        if (!payment.student) return false;
        if (department && payment.student.department !== department) return false;
        if (gender && payment.student.gender !== gender) return false;
        if (batch && payment.student.batch !== batch) return false;
        if (course && !payment.student.course.toLowerCase().includes(course.toLowerCase())) return false;
        return true;
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPayments = payments.slice(startIndex, endIndex);

    res.json({
      payments: paginatedPayments,
      totalPages: Math.ceil(payments.length / limit),
      currentPage: page,
      total: payments.length
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get miscellaneous charges (Admin only)
router.get('/miscellaneous', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      startDate = '',
      endDate = '',
      department = '',
      gender = '',
      batch = '',
      course = '',
      category = ''
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { enrollmentNumber: new RegExp(search, 'i') },
        { studentName: new RegExp(search, 'i') },
        { receiptNumber: new RegExp(search, 'i') }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Date range filter
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    let miscCharges = await MiscellaneousCharge.find(query)
      .populate('student', 'enrollmentNumber firstName lastName course department gender batch')
      .sort({ paymentDate: -1 })
      .exec();

    // Apply student-based filters after population
    if (department || gender || batch || course) {
      miscCharges = miscCharges.filter(charge => {
        if (!charge.student) return false;
        if (department && charge.student.department !== department) return false;
        if (gender && charge.student.gender !== gender) return false;
        if (batch && charge.student.batch !== batch) return false;
        if (course && !charge.student.course.toLowerCase().includes(course.toLowerCase())) return false;
        return true;
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCharges = miscCharges.slice(startIndex, endIndex);

    res.json({
      payments: paginatedCharges,
      totalPages: Math.ceil(miscCharges.length / limit),
      currentPage: page,
      total: miscCharges.length
    });
  } catch (error) {
    console.error('Get miscellaneous charges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('student')
      .populate('recordedBy', 'fullName username');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const oldPayment = await Payment.findById(req.params.id);
    if (!oldPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const oldAmount = oldPayment.amount;
    const newAmount = parseFloat(req.body.amount);

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Update student's fees if amount changed
    if (oldAmount !== newAmount) {
      const student = await Student.findById(payment.student);
      if (student) {
        student.paidFees = student.paidFees - oldAmount + newAmount;
        student.pendingFees = student.totalFees - student.paidFees;
        await student.save();
      }
    }

    res.json({ message: 'Payment updated successfully', payment });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete payment (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update student's fees
    const student = await Student.findById(payment.student);
    if (student) {
      student.paidFees -= payment.amount;
      student.pendingFees = student.totalFees - student.paidFees;
      await student.save();
    }

    await Payment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment statistics (dashboard data)
router.get('/stats/dashboard', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    // Get FEE payments (visible to all - this is for TALLY)
    const feePayments = await Payment.find(query);
    const feeCollected = feePayments.reduce((sum, p) => sum + p.amount, 0);

    // Get CASH charges (admin only - separate from fees, NOT for tally)
    let cashCollected = 0;

    if (req.user.role === 'admin') {
      const MiscellaneousCharges = await MiscellaneousCharge.find(query);
      cashCollected = MiscellaneousCharges.reduce((sum, p) => sum + p.amount, 0);
    }

    // Get FEE payment mode breakdown (for tally)
    const paymentsByMode = await Payment.aggregate([
      { $match: query },
      { $group: { _id: '$paymentMode', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Get CASH charges breakdown by category (admin only, separate from tally)
    let cashByCategory = [];
    if (req.user.role === 'admin' && cashCollected > 0) {
      cashByCategory = await MiscellaneousCharge.aggregate([
        { $match: query },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]);
    }

    // Get total students
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'active' });

    // Get pending fees total
    const studentsWithPending = await Student.find({ pendingFees: { $gt: 0 } });
    const totalPending = studentsWithPending.reduce((sum, s) => sum + (s.pendingFees || 0), 0);

    // Recent FEE payments (for tally - shown to all)
    const recentFeePayments = await Payment.find(query)
      .populate('student', 'enrollmentNumber firstName lastName')
      .sort({ paymentDate: -1 })
      .limit(10);

    // Recent CASH charges (admin only, separate section)
    let recentCashCharges = [];
    if (req.user.role === 'admin') {
      recentCashCharges = await MiscellaneousCharge.find(query)
        .populate('student', 'enrollmentNumber firstName lastName')
        .sort({ paymentDate: -1 })
        .limit(10);
    }

    res.json({
      // Fee Collection Stats (FOR TALLY - shown to all)
      feeCollected,
      paymentsByMode,
      
      // Cash Charges Stats (SEPARATE from fees - admin only)
      cashCollected: req.user.role === 'admin' ? cashCollected : 0,
      cashByCategory: req.user.role === 'admin' ? cashByCategory : [],
      
      // Student Stats
      totalStudents,
      activeStudents,
      totalPending,
      
      // Recent Transactions (separated)
      recentFeePayments,
      recentCashCharges: req.user.role === 'admin' ? recentCashCharges : [],
      
      isAdmin: req.user.role === 'admin'
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export fee payments to CSV
router.get('/export/csv', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query).sort({ paymentDate: -1 });

    // Create CSV content
    const headers = 'Receipt Number,Date,Student Name,Enrollment Number,Amount,Payment Mode,Transaction/Cheque,Recorded By,Remarks\n';
    const rows = payments.map(p => 
      `${p.receiptNumber},${new Date(p.paymentDate).toLocaleDateString()},${p.studentName},${p.enrollmentNumber},${p.amount},${p.paymentMode},${p.transactionId || p.chequeNumber || '-'},${p.recordedByName},${p.remarks || '-'}`
    ).join('\n');

    const csv = headers + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=fee-payments-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ message: 'Failed to export CSV' });
  }
});

// Export cash charges to CSV (Admin only)
router.get('/export/cash-csv', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    const payments = await MiscellaneousCharge.find(query).sort({ paymentDate: -1 });

    const headers = 'Receipt Number,Date,Student Name,Enrollment Number,Amount,Purpose,Category,Recorded By,Remarks\n';
    const rows = payments.map(p => 
      `${p.receiptNumber},${new Date(p.paymentDate).toLocaleDateString()},${p.studentName},${p.enrollmentNumber},${p.amount},${p.purpose},${p.category},${p.recordedByName},${p.remarks || '-'}`
    ).join('\n');

    const csv = headers + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=cash-charges-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ message: 'Failed to export CSV' });
  }
});

// Export fee payments to Excel
router.get('/export/excel', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query).sort({ paymentDate: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Fee Payments');

    // Add headers
    worksheet.columns = [
      { header: 'Receipt Number', key: 'receiptNumber', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Student Name', key: 'studentName', width: 25 },
      { header: 'Enrollment Number', key: 'enrollmentNumber', width: 20 },
      { header: 'Amount (₹)', key: 'amount', width: 15 },
      { header: 'Payment Mode', key: 'paymentMode', width: 15 },
      { header: 'Transaction/Cheque', key: 'transactionId', width: 20 },
      { header: 'Recorded By', key: 'recordedBy', width: 20 },
      { header: 'Remarks', key: 'remarks', width: 30 }
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0066CC' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data
    payments.forEach(p => {
      worksheet.addRow({
        receiptNumber: p.receiptNumber,
        date: new Date(p.paymentDate).toLocaleDateString(),
        studentName: p.studentName,
        enrollmentNumber: p.enrollmentNumber,
        amount: p.amount,
        paymentMode: p.paymentMode.toUpperCase(),
        transactionId: p.transactionId || p.chequeNumber || '-',
        recordedBy: p.recordedByName,
        remarks: p.remarks || '-'
      });
    });

    // Add total row
    const totalRow = worksheet.addRow({
      receiptNumber: '',
      date: '',
      studentName: '',
      enrollmentNumber: 'TOTAL',
      amount: payments.reduce((sum, p) => sum + p.amount, 0),
      paymentMode: '',
      transactionId: '',
      recordedBy: '',
      remarks: ''
    });
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=fee-payments-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Failed to export Excel' });
  }
});

// Export cash charges to Excel (Admin only)
router.get('/export/cash-excel', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    const payments = await MiscellaneousCharge.find(query).sort({ paymentDate: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cash Charges');

    worksheet.columns = [
      { header: 'Receipt Number', key: 'receiptNumber', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Student Name', key: 'studentName', width: 25 },
      { header: 'Enrollment Number', key: 'enrollmentNumber', width: 20 },
      { header: 'Amount (₹)', key: 'amount', width: 15 },
      { header: 'Purpose', key: 'purpose', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Recorded By', key: 'recordedBy', width: 20 },
      { header: 'Remarks', key: 'remarks', width: 30 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFC107' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FF000000' }, bold: true };

    payments.forEach(p => {
      worksheet.addRow({
        receiptNumber: p.receiptNumber,
        date: new Date(p.paymentDate).toLocaleDateString(),
        studentName: p.studentName,
        enrollmentNumber: p.enrollmentNumber,
        amount: p.amount,
        purpose: p.purpose,
        category: p.category,
        recordedBy: p.recordedByName,
        remarks: p.remarks || '-'
      });
    });

    const totalRow = worksheet.addRow({
      receiptNumber: '',
      date: '',
      studentName: '',
      enrollmentNumber: 'TOTAL',
      amount: payments.reduce((sum, p) => sum + p.amount, 0),
      purpose: '',
      category: '',
      recordedBy: '',
      remarks: ''
    });
    totalRow.font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=cash-charges-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Failed to export Excel' });
  }
});

// Export fee payments to PDF
router.get('/export/pdf', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query).sort({ paymentDate: -1 });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=fee-payments-${Date.now()}.pdf`);

    doc.pipe(res);

    // Title
    doc.fontSize(20).text('Sai Group of Institute', { align: 'center' });
    doc.fontSize(16).text('Fee Payments Report', { align: 'center' });
    doc.moveDown();
    
    if (startDate || endDate) {
      doc.fontSize(12).text(`Period: ${startDate || 'Beginning'} to ${endDate || 'Now'}`, { align: 'center' });
      doc.moveDown();
    }

    // Table headers
    doc.fontSize(10);
    let y = doc.y;
    doc.text('Receipt', 50, y, { width: 80 });
    doc.text('Date', 130, y, { width: 70 });
    doc.text('Student', 200, y, { width: 120 });
    doc.text('Amount', 320, y, { width: 70 });
    doc.text('Mode', 390, y, { width: 100 });

    doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
    doc.moveDown();

    // Data
    let total = 0;
    payments.forEach(p => {
      y = doc.y;
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      
      doc.text(p.receiptNumber, 50, y, { width: 80 });
      doc.text(new Date(p.paymentDate).toLocaleDateString(), 130, y, { width: 70 });
      doc.text(p.studentName.substring(0, 20), 200, y, { width: 120 });
      doc.text(`₹${p.amount.toLocaleString()}`, 320, y, { width: 70 });
      doc.text(p.paymentMode.toUpperCase(), 390, y, { width: 100 });
      
      total += p.amount;
      doc.moveDown(0.5);
    });

    // Total
    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`Total: ₹${total.toLocaleString()}`, 320, doc.y);

    doc.end();
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Failed to export PDF' });
  }
});

// Export cash charges to PDF (Admin only)
router.get('/export/cash-pdf', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    const payments = await MiscellaneousCharge.find(query).sort({ paymentDate: -1 });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cash-charges-${Date.now()}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('Sai Group of Institute', { align: 'center' });
    doc.fontSize(16).text('Cash Charges Report (Extra Fees)', { align: 'center' });
    doc.moveDown();
    
    if (startDate || endDate) {
      doc.fontSize(12).text(`Period: ${startDate || 'Beginning'} to ${endDate || 'Now'}`, { align: 'center' });
      doc.moveDown();
    }

    doc.fontSize(10);
    let y = doc.y;
    doc.text('Receipt', 50, y, { width: 80 });
    doc.text('Date', 130, y, { width: 70 });
    doc.text('Student', 200, y, { width: 100 });
    doc.text('Amount', 300, y, { width: 60 });
    doc.text('Purpose', 360, y, { width: 150 });

    doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
    doc.moveDown();

    let total = 0;
    payments.forEach(p => {
      y = doc.y;
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      
      doc.text(p.receiptNumber, 50, y, { width: 80 });
      doc.text(new Date(p.paymentDate).toLocaleDateString(), 130, y, { width: 70 });
      doc.text(p.studentName.substring(0, 15), 200, y, { width: 100 });
      doc.text(`₹${p.amount.toLocaleString()}`, 300, y, { width: 60 });
      doc.text((p.purpose || '').substring(0, 30), 360, y, { width: 150 });
      
      total += p.amount;
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`Total: ₹${total.toLocaleString()}`, 300, doc.y);

    doc.end();
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Failed to export PDF' });
  }
});

module.exports = router;
