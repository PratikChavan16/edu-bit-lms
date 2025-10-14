import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiUpload, FiPlus, FiSearch, FiTrash2, FiEye } from 'react-icons/fi';
import './Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/students', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm
        }
      });
      setStudents(response.data.students);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages
      }));
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await api.post('/students/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`CSV uploaded! Inserted: ${response.data.results.inserted}, Updated: ${response.data.results.updated}`);
      
      if (response.data.results.errors.length > 0) {
        console.log('Errors:', response.data.results.errors);
        toast.warning(`${response.data.results.errors.length} errors occurred. Check console.`);
      }
      
      setShowUploadModal(false);
      setCsvFile(null);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload CSV');
    }
  };

  const handleAddStudent = async (formData) => {
    try {
      await api.post('/students', formData);
      toast.success('Student added successfully');
      setShowAddModal(false);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  return (
    <div className="students-page">
      <div className="page-header">
        <h1>Student Management</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowUploadModal(true)}>
            <FiUpload /> Upload CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <FiPlus /> Add Student
          </button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name, enrollment number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="students-table-container">
        {loading ? (
          <div className="loading">Loading students...</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Enrollment No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Total Fees</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.enrollmentNumber}</td>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>{student.batch}</td>
                    <td>₹{student.totalFees?.toLocaleString()}</td>
                    <td>₹{student.paidFees?.toLocaleString()}</td>
                    <td>₹{student.pendingFees?.toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${student.status === 'active' ? 'success' : 'warning'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon btn-view" 
                          onClick={() => setSelectedStudent(student)}
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        <button 
                          className="btn-icon btn-delete" 
                          onClick={() => handleDeleteStudent(student._id)}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {students.length === 0 && (
              <div className="no-data">No students found</div>
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

      {/* CSV Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Upload CSV File</h2>
            <form onSubmit={handleFileUpload}>
              <div className="form-group">
                <label>Select CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  required
                />
                <small>CSV should contain: enrollmentNumber, firstName, lastName, email, phone, course, batch, admissionDate, totalFees</small>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal 
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddStudent}
        />
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetailsModal 
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

// Add Student Modal Component
const AddStudentModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    enrollmentNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    course: '',
    batch: '',
    admissionDate: '',
    totalFees: '',
    address: '',
    parentName: '',
    parentPhone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Enrollment Number *</label>
              <input
                type="text"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Course *</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Batch *</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Admission Date *</label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Total Fees *</label>
              <input
                type="number"
                name="totalFees"
                value={formData.totalFees}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Parent Name</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Parent Phone</label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              rows="3"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Student Details Modal Component
const StudentDetailsModal = ({ student, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <h2>Student Details</h2>
        <div className="student-details">
          <div className="details-grid">
            <div className="detail-item">
              <label>Enrollment Number:</label>
              <span>{student.enrollmentNumber}</span>
            </div>
            <div className="detail-item">
              <label>Full Name:</label>
              <span>{student.firstName} {student.lastName}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{student.email}</span>
            </div>
            <div className="detail-item">
              <label>Phone:</label>
              <span>{student.phone}</span>
            </div>
            <div className="detail-item">
              <label>Course:</label>
              <span>{student.course}</span>
            </div>
            <div className="detail-item">
              <label>Batch:</label>
              <span>{student.batch}</span>
            </div>
            <div className="detail-item">
              <label>Admission Date:</label>
              <span>{new Date(student.admissionDate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <label>Status:</label>
              <span className={`badge badge-${student.status === 'active' ? 'success' : 'warning'}`}>
                {student.status}
              </span>
            </div>
            <div className="detail-item">
              <label>Total Fees:</label>
              <span>₹{student.totalFees?.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <label>Paid Fees:</label>
              <span className="text-success">₹{student.paidFees?.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <label>Pending Fees:</label>
              <span className="text-danger">₹{student.pendingFees?.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <label>Parent Name:</label>
              <span>{student.parentName || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Parent Phone:</label>
              <span>{student.parentPhone || 'N/A'}</span>
            </div>
          </div>
          {student.address && (
            <div className="detail-item full-width">
              <label>Address:</label>
              <span>{student.address}</span>
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Students;
