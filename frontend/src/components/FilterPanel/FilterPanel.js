import React, { useState, useEffect } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import './FilterPanel.css';

const FilterPanel = ({ onFilterChange, filterType = 'students' }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});
  const [filters, setFilters] = useState({
    department: '',
    gender: '',
    batch: '',
    course: '',
    status: '',
    paymentStatus: '',
    paymentMode: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchFilterOptions();
  }, [filterType]);

  const fetchFilterOptions = async () => {
    try {
      const response = await api.get('/students/filters/options');
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      department: '',
      gender: '',
      batch: '',
      course: '',
      status: '',
      paymentStatus: '',
      paymentMode: '',
      category: '',
      startDate: '',
      endDate: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="filter-panel-container">
      <button 
        className={`filter-toggle-btn ${activeFilterCount > 0 ? 'active' : ''}`}
        onClick={() => setShowFilters(!showFilters)}
      >
        <FiFilter /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-panel-header">
            <h3>🔍 Filter Options</h3>
            <button className="close-btn" onClick={() => setShowFilters(false)}>
              <FiX />
            </button>
          </div>

          <div className="filter-grid">
            {/* Department Filter */}
            {(filterType === 'students' || filterType === 'payments') && (
              <div className="filter-item">
                <label>Department</label>
                <select name="department" value={filters.department} onChange={handleFilterChange}>
                  <option value="">All Departments</option>
                  {filterOptions.departments?.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Gender Filter */}
            {(filterType === 'students' || filterType === 'payments') && (
              <div className="filter-item">
                <label>Gender</label>
                <select name="gender" value={filters.gender} onChange={handleFilterChange}>
                  <option value="">All Genders</option>
                  {filterOptions.genders?.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Batch Filter */}
            {(filterType === 'students' || filterType === 'payments') && (
              <div className="filter-item">
                <label>Batch</label>
                <select name="batch" value={filters.batch} onChange={handleFilterChange}>
                  <option value="">All Batches</option>
                  {filterOptions.batches?.map(batch => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Course Filter */}
            {(filterType === 'students' || filterType === 'payments') && (
              <div className="filter-item">
                <label>Course</label>
                <select name="course" value={filters.course} onChange={handleFilterChange}>
                  <option value="">All Courses</option>
                  {filterOptions.courses?.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Student Status Filter */}
            {filterType === 'students' && (
              <div className="filter-item">
                <label>Student Status</label>
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="">All Statuses</option>
                  {filterOptions.statuses?.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Payment Status Filter */}
            {filterType === 'students' && (
              <div className="filter-item">
                <label>Payment Status</label>
                <select name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange}>
                  <option value="">All Payment Statuses</option>
                  {filterOptions.paymentStatuses?.map(ps => (
                    <option key={ps.value} value={ps.value}>{ps.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Payment Mode Filter */}
            {filterType === 'payments' && (
              <div className="filter-item">
                <label>Payment Mode</label>
                <select name="paymentMode" value={filters.paymentMode} onChange={handleFilterChange}>
                  <option value="">All Modes</option>
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
            )}

            {/* Category Filter (for misc charges) */}
            {filterType === 'miscellaneous' && (
              <div className="filter-item">
                <label>Category</label>
                <select name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="">All Categories</option>
                  <option value="Library Fine">Library Fine</option>
                  <option value="Lab Fee">Lab Fee</option>
                  <option value="Exam Fee">Exam Fee</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Late Fee">Late Fee</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {/* Date Range Filters */}
            {(filterType === 'payments' || filterType === 'miscellaneous') && (
              <>
                <div className="filter-item">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-item">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                  />
                </div>
              </>
            )}
          </div>

          <div className="filter-actions">
            <button className="btn-clear" onClick={clearFilters}>
              <FiX /> Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
