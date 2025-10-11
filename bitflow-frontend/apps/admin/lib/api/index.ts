/**
 * API Services Index
 * Central export point for all API services
 */

// Explicitly re-export PaginatedResponse from universities with an alias to avoid conflicts
export type { PaginatedResponse as UniversitiesPaginatedResponse } from './universities';
// export other values if needed: export { otherExport } from './universities';
// Explicitly re-export PaginatedResponse from colleges with an alias to avoid conflicts
export type { PaginatedResponse as CollegesPaginatedResponse } from './colleges';
// export { otherExport } from './colleges'; // Uncomment and specify value exports if needed
// Explicitly re-export PaginatedResponse from departments with an alias to avoid conflicts
export type { PaginatedResponse as DepartmentsPaginatedResponse } from './departments';
// Explicitly export only the required members from departments to avoid PaginatedResponse conflict
// export { getDepartments } from './departments'; // Removed because getDepartments does not exist
// Explicitly export only the required members from courses and subjects to avoid PaginatedResponse conflict
// export { createCourse, updateCourse, deleteCourse } from './courses'; // Removed because these members do not exist
// export { getSubjects, createSubject, updateSubject, deleteSubject } from './subjects'; // Removed because getSubjects does not exist
// Explicitly re-export only the required members from batches to avoid PaginatedResponse conflict
// export { getBatches, createBatch, updateBatch, deleteBatch } from './batches'; // Removed because these members do not exist
// Explicitly re-export only the required members from students and faculty to avoid PaginatedResponse conflict
// export { getStudents, createStudent, updateStudent, deleteStudent } from './students'; // Removed because these members do not exist
export type { Faculty } from './faculty';

// Re-export API client
export { api, apiClient, type ApiError } from '../api-client';
