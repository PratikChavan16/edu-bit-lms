import { useAuth } from '@/contexts/AuthContext'

/**
 * Hook for checking permissions in components
 * Uses the auth context to determine user permissions
 */
export function usePermissions() {
  const { user, hasPermission, hasRole } = useAuth()

  /**
   * Check if user can create departments
   */
  const canCreateDepartment = hasPermission(['bitflow_owner', 'university_owner', 'super_admin', 'principal'])

  /**
   * Check if user can edit departments
   */
  const canEditDepartment = hasPermission(['bitflow_owner', 'university_owner', 'super_admin', 'principal'])

  /**
   * Check if user can delete departments
   */
  const canDeleteDepartment = hasPermission(['bitflow_owner', 'university_owner', 'super_admin'])

  /**
   * Check if user can create students
   */
  const canCreateStudent = hasPermission([
    'bitflow_owner',
    'university_owner',
    'super_admin',
    'principal',
    'college_admin',
    'admission_admin',
  ])

  /**
   * Check if user can edit students
   */
  const canEditStudent = hasPermission([
    'bitflow_owner',
    'university_owner',
    'super_admin',
    'principal',
    'college_admin',
    'admission_admin',
  ])

  /**
   * Check if user can delete students
   */
  const canDeleteStudent = hasPermission(['bitflow_owner', 'university_owner', 'super_admin', 'principal'])

  /**
   * Check if user can create faculty
   */
  const canCreateFaculty = hasPermission([
    'bitflow_owner',
    'university_owner',
    'super_admin',
    'principal',
    'super_academics',
  ])

  /**
   * Check if user can edit faculty
   */
  const canEditFaculty = hasPermission([
    'bitflow_owner',
    'university_owner',
    'super_admin',
    'principal',
    'super_academics',
  ])

  /**
   * Check if user can delete faculty
   */
  const canDeleteFaculty = hasPermission(['bitflow_owner', 'university_owner', 'super_admin'])

  /**
   * Check if user can manage users
   */
  const canManageUsers = hasPermission(['bitflow_owner', 'university_owner', 'super_admin'])

  /**
   * Check if user can manage colleges
   */
  const canManageColleges = hasPermission(['bitflow_owner', 'university_owner', 'super_admin'])

  /**
   * Check if user can view reports
   */
  const canViewReports = hasPermission([
    'bitflow_owner',
    'university_owner',
    'super_admin',
    'principal',
    'college_admin',
    'super_academics',
  ])

  /**
   * Check if user can manage finances
   */
  const canManageFinances = hasPermission([
    'bitflow_owner',
    'university_owner',
    'super_admin',
    'super_accountant',
    'college_accounts_admin',
    'college_fee_admin',
  ])

  return {
    user,
    hasPermission,
    hasRole,
    canCreateDepartment,
    canEditDepartment,
    canDeleteDepartment,
    canCreateStudent,
    canEditStudent,
    canDeleteStudent,
    canCreateFaculty,
    canEditFaculty,
    canDeleteFaculty,
    canManageUsers,
    canManageColleges,
    canViewReports,
    canManageFinances,
  }
}
