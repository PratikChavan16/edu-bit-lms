'use client';

import { use, useState, useEffect } from 'react';
import { useCollege } from '@/contexts/CollegeContext';
import { useUniversity } from '@/contexts/UniversityContext';
import { useToast } from '@/components/ui/toast';
import { handleError, handleSuccess, confirmAction } from '@/lib/errorHandler';
import { apiClient } from '@/lib/api-client';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectOption } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertCircle, Users, Plus, UserCog, Trash2, Shield, GraduationCap, UserPlus } from 'lucide-react';

interface LeadershipMember {
  id: string;
  user_id: string;
  role: 'principal' | 'vice_principal' | 'college_admin' | 'hod';
  department_id?: string;
  department_name?: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    employee_id?: string;
  };
  assigned_date: string;
  status: 'active' | 'inactive';
}

interface Department {
  id: string;
  name: string;
  code: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  employee_id?: string;
}

export default function LeadershipPage({ params }: { params: Promise<{ id: string; collegeId: string }> }) {
  const { id, collegeId } = use(params);
  const { university } = useUniversity();
  const { college, loading, error } = useCollege();
  const toast = useToast();

  const [leadership, setLeadership] = useState<LeadershipMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'assign' | 'create'>('assign');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form for assigning existing user
  const [assignFormData, setAssignFormData] = useState({
    user_id: '',
    role: 'principal' as 'principal' | 'vice_principal' | 'college_admin' | 'hod',
    department_id: '',
  });

  // Form for creating new user
  const [createFormData, setCreateFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    employee_id: '',
    role: 'principal' as 'principal' | 'vice_principal' | 'college_admin' | 'hod',
    department_id: '',
    password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (college && university) {
      fetchData();
    }
  }, [college, university]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data, but don't fail if individual requests fail
      const results = await Promise.allSettled([
        fetchLeadership(),
        fetchDepartments(),
        fetchUsers(),
      ]);
      
      // Log any failures in development
      if (process.env.NODE_ENV === 'development') {
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const names = ['fetchLeadership', 'fetchDepartments', 'fetchUsers'];
            console.warn(`${names[index]} failed:`, result.reason);
          }
        });
      }
    } catch (err) {
      handleError(err, toast, { customMessage: 'Failed to load leadership data' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeadership = async () => {
    try {
      const response = await apiClient.get<{ 
        success: boolean;
        data: {
          college: { id: string; name: string; code: string };
          principal: any;
          college_admin: any;
          other_leaders: any[];
        }
      }>(
        `/admin/universities/${id}/colleges/${collegeId}/leadership`
      );
      
      // Transform the response to match our component structure
      const leadershipData: LeadershipMember[] = [];
      const apiData = response.data;
      
      if (apiData.principal) {
        leadershipData.push({
          id: apiData.principal.id,
          user_id: apiData.principal.id,
          role: 'principal',
          user: {
            id: apiData.principal.id,
            first_name: apiData.principal.name.split(' ')[0] || '',
            last_name: apiData.principal.name.split(' ').slice(1).join(' ') || '',
            email: apiData.principal.email,
            phone: apiData.principal.phone,
          },
          assigned_date: new Date().toISOString(),
          status: apiData.principal.status || 'active',
        });
      }
      
      if (apiData.college_admin) {
        leadershipData.push({
          id: apiData.college_admin.id,
          user_id: apiData.college_admin.id,
          role: 'college_admin',
          user: {
            id: apiData.college_admin.id,
            first_name: apiData.college_admin.name.split(' ')[0] || '',
            last_name: apiData.college_admin.name.split(' ').slice(1).join(' ') || '',
            email: apiData.college_admin.email,
            phone: apiData.college_admin.phone,
          },
          assigned_date: new Date().toISOString(),
          status: apiData.college_admin.status || 'active',
        });
      }
      
      if (apiData.other_leaders?.length) {
        apiData.other_leaders.forEach((leader: any) => {
          leadershipData.push({
            id: leader.id,
            user_id: leader.id,
            role: leader.role as any,
            user: {
              id: leader.id,
              first_name: leader.name.split(' ')[0] || '',
              last_name: leader.name.split(' ').slice(1).join(' ') || '',
              email: leader.email,
              phone: leader.phone,
            },
            assigned_date: new Date().toISOString(),
            status: leader.status || 'active',
          });
        });
      }
      
      setLeadership(leadershipData);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setLeadership([]);
      } else {
        throw err;
      }
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Department[] }>(
        `/admin/universities/${id}/colleges/${collegeId}/departments`
      );
      setDepartments(response.data || []);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setDepartments([]);
      } else {
        throw err;
      }
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch all users for this college/university
      const response = await apiClient.get<{ success: boolean; data: User[] }>(
        `/admin/users?college_id=${collegeId}`
      );
      setUsers(response.data || []);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setUsers([]);
      } else {
        throw err;
      }
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await apiClient.post(
        `/admin/universities/${id}/colleges/${collegeId}/leadership`,
        assignFormData
      );
      
      handleSuccess('leadership_assigned', toast);
      setShowAddForm(false);
      setAssignFormData({ user_id: '', role: 'principal', department_id: '' });
      fetchLeadership();
    } catch (err) {
      handleError(err, toast, { customMessage: 'Failed to assign leadership role' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate passwords match
    if (createFormData.password !== createFormData.confirm_password) {
      toast.error('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      // First create the user using the correct endpoint
      const createUserResponse: any = await apiClient.post(
        `/admin/users`,
        {
          first_name: createFormData.first_name,
          last_name: createFormData.last_name,
          email: createFormData.email,
          phone: createFormData.phone,
          employee_id: createFormData.employee_id,
          password: createFormData.password,
          university_id: id,
          college_id: collegeId,
          status: 'active',
        }
      );

      const newUserId = createUserResponse.data.id;

      // Then assign the leadership role
      await apiClient.post(
        `/admin/universities/${id}/colleges/${collegeId}/leadership`,
        {
          user_id: newUserId,
          role: createFormData.role,
          department_id: createFormData.role === 'hod' ? createFormData.department_id : undefined,
        }
      );

      handleSuccess('user_created_and_assigned', toast);
      setShowAddForm(false);
      setCreateFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        employee_id: '',
        role: 'principal',
        department_id: '',
        password: '',
        confirm_password: '',
      });
      fetchData(); // Refresh all data including users list
    } catch (err) {
      handleError(err, toast, { customMessage: 'Failed to create user and assign role' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    const confirmed = await confirmAction({
      message: 'Are you sure you want to remove this leadership assignment?',
      danger: true,
    });

    if (!confirmed) return;

    try {
      await apiClient.delete(
        `/admin/universities/${id}/colleges/${collegeId}/leadership/${userId}`
      );
      
      handleSuccess('leadership_removed', toast);
      fetchLeadership();
    } catch (err) {
      handleError(err, toast, { customMessage: 'Failed to remove leadership assignment' });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'principal':
        return <Shield className="w-6 h-6 text-purple-600" />;
      case 'vice_principal':
        return <Shield className="w-6 h-6 text-indigo-600" />;
      case 'college_admin':
        return <UserCog className="w-6 h-6 text-blue-600" />;
      case 'hod':
        return <GraduationCap className="w-6 h-6 text-green-600" />;
      default:
        return <Users className="w-6 h-6 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'principal':
        return 'Principal';
      case 'vice_principal':
        return 'Vice Principal';
      case 'college_admin':
        return 'College Admin';
      case 'hod':
        return 'Head of Department';
      default:
        return role;
    }
  };

  const roleOptions: SelectOption[] = [
    { label: 'Principal', value: 'principal' },
    { label: 'Vice Principal', value: 'vice_principal' },
    { label: 'College Admin', value: 'college_admin' },
    { label: 'Head of Department (HOD)', value: 'hod' },
  ];

  const userOptions: SelectOption[] = users.map(user => ({
    label: `${user.first_name} ${user.last_name} (${user.email})`,
    value: user.id,
  }));

  const departmentOptions: SelectOption[] = departments.map(dept => ({
    label: `${dept.name} (${dept.code})`,
    value: dept.id,
  }));

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading College</h2>
          <p className="text-gray-600 dark:text-gray-400">{error || 'College not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Universities', href: '/universities' },
          { label: university?.name || 'University', href: `/universities/${id}` },
          { label: 'Colleges', href: `/universities/${id}/colleges` },
          { label: college.name, href: `/universities/${id}/colleges/${collegeId}` },
          { label: 'Leadership', current: true },
        ]}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Users className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leadership Team</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage Principal, Admins, and Department Heads for {college.name}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Leadership
          </Button>
        </div>

        {/* Add Leadership Form with Tabs */}
        {showAddForm && (
          <Card className="mb-6 p-6 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Leadership Member
            </h3>
            
            {/* Tabs */}
            <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => setActiveTab('assign')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === 'assign'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Assign Existing User
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === 'create'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <UserPlus className="w-4 h-4 inline mr-1" />
                Create New User
              </button>
            </div>

            {/* Assign Existing User Form */}
            {activeTab === 'assign' && (
              <>
                {users.length === 0 && (
                  <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">No Users Available</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          No existing users found. You can create a new user in the "Create New User" tab or add users in:
                        </p>
                        <div className="mt-2 space-x-2">
                          <a
                            href={`/universities/${id}/colleges/${collegeId}/academic-staff`}
                            className="inline-flex items-center text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline"
                          >
                            Academic Staff →
                          </a>
                          <span className="text-yellow-600">•</span>
                          <a
                            href={`/universities/${id}/colleges/${collegeId}/administrative-staff`}
                            className="inline-flex items-center text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline"
                          >
                            Administrative Staff →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleAssignSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select User <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={assignFormData.user_id}
                        onChange={(value) => setAssignFormData({ ...assignFormData, user_id: value })}
                        options={userOptions}
                        placeholder="Select a user"
                        required
                        disabled={users.length === 0}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Leadership Role <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={assignFormData.role}
                        onChange={(value) => setAssignFormData({ ...assignFormData, role: value as any })}
                        options={roleOptions}
                        required
                      />
                    </div>

                    {assignFormData.role === 'hod' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={assignFormData.department_id}
                          onChange={(value) => setAssignFormData({ ...assignFormData, department_id: value })}
                          options={departmentOptions}
                          placeholder="Select department for HOD"
                          required={assignFormData.role === 'hod'}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setAssignFormData({ user_id: '', role: 'principal', department_id: '' });
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || users.length === 0}>
                      {isSubmitting ? 'Assigning...' : 'Assign Role'}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {/* Create New User Form */}
            {activeTab === 'create' && (
              <form onSubmit={handleCreateSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      type="text"
                      value={createFormData.first_name}
                      onChange={(e) => setCreateFormData({ ...createFormData, first_name: e.target.value })}
                      placeholder="John"
                      required
                    />
                    <Input
                      label="Last Name"
                      type="text"
                      value={createFormData.last_name}
                      onChange={(e) => setCreateFormData({ ...createFormData, last_name: e.target.value })}
                      placeholder="Doe"
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      placeholder="john.doe@university.edu"
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={createFormData.phone}
                      onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                    />
                    <Input
                      label="Employee ID"
                      type="text"
                      value={createFormData.employee_id}
                      onChange={(e) => setCreateFormData({ ...createFormData, employee_id: e.target.value })}
                      placeholder="EMP001"
                    />
                  </div>
                </div>

                {/* Leadership Role */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Leadership Assignment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Leadership Role <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={createFormData.role}
                        onChange={(value) => setCreateFormData({ ...createFormData, role: value as any })}
                        options={roleOptions}
                        required
                      />
                    </div>

                    {createFormData.role === 'hod' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={createFormData.department_id}
                          onChange={(value) => setCreateFormData({ ...createFormData, department_id: value })}
                          options={departmentOptions}
                          placeholder="Select department for HOD"
                          required={createFormData.role === 'hod'}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Security</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Password"
                      type="password"
                      value={createFormData.password}
                      onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      value={createFormData.confirm_password}
                      onChange={(e) => setCreateFormData({ ...createFormData, confirm_password: e.target.value })}
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setCreateFormData({
                        first_name: '',
                        last_name: '',
                        email: '',
                        phone: '',
                        employee_id: '',
                        role: 'principal',
                        department_id: '',
                        password: '',
                        confirm_password: '',
                      });
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create User & Assign Role'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        )}

        {/* Leadership List */}
        {leadership.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Leadership Assigned
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by assigning leadership roles to manage your college effectively.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Assign First Role
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((member) => (
              <Card key={member.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(member.role)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {getRoleLabel(member.role)}
                      </h3>
                      {member.department_name && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.department_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(member.user_id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {member.user.first_name} {member.user.last_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.user.email}
                    </p>
                  </div>
                  {member.user.employee_id && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {member.user.employee_id}
                    </p>
                  )}
                  {member.user.phone && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.user.phone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Assigned: {new Date(member.assigned_date).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
