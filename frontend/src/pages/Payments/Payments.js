import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiSearch } from 'react-icons/fi';
import './Payments.css';

const Payments = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('online'); // 'online' or 'cash'
  const [payments, setPayments] = useState([]);
  const [cashPayments, setCashPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    paymentMode: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch online/non-cash payments
      const response = await api.get('/payments', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          ...filters
        }
      });
      setPayments(response.data.payments);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages
      }));
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, filters]);

  const fetchCashPayments = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const response = await api.get('/payments/cash', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          startDate: filters.startDate,
          endDate: filters.endDate
        }
      });
      setCashPayments(response.data.payments);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages
      }));
    } catch (error) {
      toast.error('Failed to fetch cash payments');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, pagination.page, pagination.limit, searchTerm, filters.startDate, filters.endDate]);

  useEffect(() => {
    if (activeTab === 'online') {
      fetchPayments();
    } else if (activeTab === 'cash' && isAdmin) {
      fetchCashPayments();
    }
  }, [activeTab, fetchPayments, fetchCashPayments, isAdmin]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students', { params: { limit: 1000 } });
      setStudents(response.data.students);
    } catch (error) {
      console.error('Failed to fetch students');
    }
  };

  const handleAddPayment = async (paymentData) => {
    try {
      await api.post('/payments', paymentData);
      toast.success('Payment recorded successfully');
      setShowAddModal(false);
      
      // Refresh the appropriate tab
      if (paymentData.paymentMode === 'cash') {
        setActiveTab('cash');
        fetchCashPayments();
      } else {
        setActiveTab('online');
        fetchPayments();
      }
      
      // Also refresh students to update their fees
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    }
  };

  const handleDeletePayment = async (id) => {
    if (!isAdmin) {
      toast.error('Only admins can delete payments');
      return;
    }

    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await api.delete(`/payments/${id}`);
        toast.success('Payment deleted successfully');
        fetchPayments();
      } catch (error) {
        toast.error('Failed to delete payment');
      }
    }
  };

  const currentPayments = activeTab === 'cash' ? cashPayments : payments;

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1>Payment Management</h1>
        <div className="header-actions">
          <div className="export-dropdown">
            <button className="btn btn-secondary">📥 Export</button>
            <div className="export-menu">
              <a 
                href={`http://localhost:5000/api/payments/export/${activeTab === 'cash' ? 'cash-' : ''}csv?${new URLSearchParams(filters)}`}
                download
              >
                📄 Export as CSV
              </a>
              <a 
                href={`http://localhost:5000/api/payments/export/${activeTab === 'cash' ? 'cash-' : ''}excel?${new URLSearchParams(filters)}`}
                download
              >
                📊 Export as Excel
              </a>
              <a 
                href={`http://localhost:5000/api/payments/export/${activeTab === 'cash' ? 'cash-' : ''}pdf?${new URLSearchParams(filters)}`}
                download
              >
                📕 Export as PDF
              </a>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <FiPlus /> Record Payment
          </button>
        </div>
      </div>

      {/* Tabs for Admin */}
      {isAdmin && (
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'online' ? 'active' : ''}`}
            onClick={() => setActiveTab('online')}
          >
            <span className="tab-icon">💳</span>
            Fee Payments
            <small>For Tally</small>
          </button>
          <button 
            className={`tab-button ${activeTab === 'cash' ? 'active' : ''}`}
            onClick={() => setActiveTab('cash')}
          >
            <span className="tab-icon">💵</span>
            Cash Charges
            <small>Extra Fees (Admin Only)</small>
          </button>
        </div>
      )}
      
      {/* Title for Accountant */}
      {!isAdmin && (
        <div className="page-subtitle">
          <h2>Fee Payments (For Tally)</h2>
        </div>
      )}

      <div className="filters-section">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by receipt, enrollment, or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          {activeTab === 'online' && (
            <select
              value={filters.paymentMode}
              onChange={(e) => setFilters({ ...filters, paymentMode: e.target.value })}
              className="form-control"
            >
              <option value="">All Payment Modes</option>
              <option value="online">Online</option>
              <option value="cheque">Cheque</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          )}

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="form-control"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="form-control"
            placeholder="End Date"
          />

          <button 
            className="btn btn-secondary" 
            onClick={() => setFilters({ paymentMode: '', startDate: '', endDate: '' })}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="payments-table-container">
        {loading ? (
          <div className="loading">Loading payments...</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Receipt No.</th>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Enrollment</th>
                  <th>Amount</th>
                  {activeTab === 'cash' ? (
                    <>
                      <th>Purpose</th>
                      <th>Category</th>
                    </>
                  ) : (
                    <>
                      <th>Mode</th>
                      <th>Transaction/Cheque</th>
                    </>
                  )}
                  <th>Recorded By</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td><strong>{payment.receiptNumber}</strong></td>
                    <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td>{payment.studentName}</td>
                    <td>{payment.enrollmentNumber}</td>
                    <td><strong>₹{payment.amount.toLocaleString()}</strong></td>
                    {activeTab === 'cash' ? (
                      <>
                        <td>{payment.purpose || '-'}</td>
                        <td>
                          <span className="badge badge-info">
                            {payment.category || 'Miscellaneous'}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <span className="badge badge-success">
                            {payment.paymentMode?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {payment.transactionId || payment.chequeNumber || '-'}
                        </td>
                      </>
                    )}
                    <td>{payment.recordedByName || payment.recordedBy?.fullName}</td>
                    {isAdmin && (
                      <td>
                        <button 
                          className="btn-icon btn-delete" 
                          onClick={() => handleDeletePayment(payment._id)}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {currentPayments.length === 0 && (
              <div className="no-data">No payments found</div>
            )}

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button 
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <AddPaymentModal 
          students={students}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPayment}
        />
      )}
    </div>
  );
};

// Add Payment Modal Component
const AddPaymentModal = ({ students, onClose, onSubmit }) => {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    paymentMode: 'online',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    chequeNumber: '',
    purpose: '',
    category: 'Miscellaneous',
    remarks: ''
  });

  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'studentId') {
      const student = students.find(s => s._id === value);
      setSelectedStudent(student);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <h2>
          {formData.paymentMode === 'cash' ? '💵 Record Cash Charge (Extra Fee)' : '💳 Record Fee Payment (For Tally)'}
        </h2>
        {formData.paymentMode === 'cash' && (
          <div className="info-banner warning">
            ⚠️ Cash charges are extra fees (library fines, lab fees, etc.) and do NOT affect student tuition fee balance.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Student *</label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">-- Select Student --</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.enrollmentNumber} - {student.firstName} {student.lastName} 
                  (Pending: ₹{student.pendingFees?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div className="student-info-card">
              <h4>Student Information</h4>
              <div className="info-grid">
                <div>
                  <strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.lastName}
                </div>
                <div>
                  <strong>Course:</strong> {selectedStudent.course}
                </div>
                <div>
                  <strong>Total Fees:</strong> ₹{selectedStudent.totalFees?.toLocaleString()}
                </div>
                <div>
                  <strong>Paid:</strong> ₹{selectedStudent.paidFees?.toLocaleString()}
                </div>
                <div className="pending-highlight">
                  <strong>Pending:</strong> ₹{selectedStudent.pendingFees?.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="1"
                className="form-control"
                placeholder="Enter amount"
              />
            </div>

            <div className="form-group">
              <label>Payment Type *</label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                required
                className="form-control"
              >
                <optgroup label="Fee Payments (For Tally)">
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </optgroup>
                {isAdmin && (
                  <optgroup label="Cash Charges (Extra Fees)">
                    <option value="cash">Cash Charge</option>
                  </optgroup>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Payment Date *</label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            {/* For Cash Payments - Show Purpose and Category */}
            {formData.paymentMode === 'cash' && (
              <>
                <div className="form-group">
                  <label>Purpose *</label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="e.g., Library fine for book delay"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="Library Fine">Library Fine</option>
                    <option value="Lab Fee">Lab Fee</option>
                    <option value="Exam Fee">Exam Fee</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Sports">Sports</option>
                    <option value="Books">Books</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* For Fee Payments - Show Transaction Details */}
            {(formData.paymentMode === 'online' || formData.paymentMode === 'upi') && (
              <div className="form-group">
                <label>Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter transaction ID"
                />
              </div>
            )}

            {formData.paymentMode === 'cheque' && (
              <div className="form-group">
                <label>Cheque Number</label>
                <input
                  type="text"
                  name="chequeNumber"
                  value={formData.chequeNumber}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter cheque number"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payments;
