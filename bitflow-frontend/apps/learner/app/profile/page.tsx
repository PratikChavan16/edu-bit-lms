'use client';

import { useState } from 'react';
import { useLearnerProfile, useUpdateProfile, useUploadProfilePicture } from '@bitflow/api-client/learner';
import { Card, Button, Input, Label, Avatar, FileUpload } from '@bitflow/ui';
import { User, Mail, Phone, MapPin, Calendar, Droplet, AlertTriangle, Save, Upload } from 'lucide-react';

export default function ProfilePage() {
  const { data: profile, isLoading, refetch } = useLearnerProfile();
  const updateProfile = useUpdateProfile({
    onSuccess: () => {
      refetch();
      setIsEditing(false);
    },
  });
  const uploadPicture = useUploadProfilePicture({
    onSuccess: () => {
      refetch();
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile || {});

  const handleSave = () => {
    updateProfile.mutate(formData);
  };

  const handleFileUpload = (files: File[]) => {
    if (files[0]) {
      uploadPicture.mutate(files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-8 text-center">
          <p className="text-red-600">Failed to load profile</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600 mt-1">View and update your personal information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateProfile.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Card */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center">
            <Avatar
              src={profile.profile_picture}
              alt={profile.name}
              fallback={profile.name.charAt(0)}
              size="xl"
            />
            <h2 className="text-xl font-bold mt-4">{profile.name}</h2>
            <p className="text-gray-600">{profile.roll_number}</p>
            <p className="text-sm text-gray-500">{profile.enrollment_number}</p>

            {isEditing && (
              <div className="mt-4 w-full">
                <FileUpload
                  onFilesChange={handleFileUpload}
                  accept="image/*"
                  maxFiles={1}
                  maxSize={5 * 1024 * 1024} // 5MB
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Upload a new profile picture (Max 5MB)
                </p>
              </div>
            )}

            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium">{profile.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Semester</p>
                  <p className="font-medium">{profile.semester}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information Card */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-gray-500" />
                <Input
                  id="name"
                  value={isEditing ? formData.name : profile.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? formData.email : profile.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-4 w-4 text-gray-500" />
                <Input
                  id="phone"
                  type="tel"
                  value={isEditing ? formData.phone : profile.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input
                  id="dob"
                  type="date"
                  value={
                    isEditing
                      ? formData.date_of_birth
                      : profile.date_of_birth || ''
                  }
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="blood_group">Blood Group</Label>
              <div className="flex items-center gap-2 mt-1">
                <Droplet className="h-4 w-4 text-gray-500" />
                <Input
                  id="blood_group"
                  value={
                    isEditing
                      ? formData.blood_group
                      : profile.blood_group || ''
                  }
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g., A+"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                value={profile.course}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="address">Address</Label>
            <div className="flex items-start gap-2 mt-1">
              <MapPin className="h-4 w-4 text-gray-500 mt-2" />
              <div className="flex-1 space-y-2">
                <Input
                  id="address_line1"
                  placeholder="Address Line 1"
                  value={
                    isEditing
                      ? formData.address?.line1
                      : profile.address?.line1 || ''
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, line1: e.target.value },
                    })
                  }
                  disabled={!isEditing}
                />
                <Input
                  id="address_line2"
                  placeholder="Address Line 2"
                  value={
                    isEditing
                      ? formData.address?.line2
                      : profile.address?.line2 || ''
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, line2: e.target.value },
                    })
                  }
                  disabled={!isEditing}
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="City"
                    value={
                      isEditing
                        ? formData.address?.city
                        : profile.address?.city || ''
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Input
                    placeholder="State"
                    value={
                      isEditing
                        ? formData.address?.state
                        : profile.address?.state || ''
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                    disabled={!isEditing}
                  />
                  <Input
                    placeholder="Pincode"
                    value={
                      isEditing
                        ? formData.address?.pincode
                        : profile.address?.pincode || ''
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, pincode: e.target.value },
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Emergency Contact Card */}
        <Card className="p-6 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergency_name">Contact Name</Label>
              <Input
                id="emergency_name"
                value={
                  isEditing
                    ? formData.emergency_contact?.name
                    : profile.emergency_contact?.name || ''
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergency_contact: { ...formData.emergency_contact, name: e.target.value },
                  })
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="emergency_relation">Relation</Label>
              <Input
                id="emergency_relation"
                value={
                  isEditing
                    ? formData.emergency_contact?.relation
                    : profile.emergency_contact?.relation || ''
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergency_contact: { ...formData.emergency_contact, relation: e.target.value },
                  })
                }
                disabled={!isEditing}
                placeholder="e.g., Father, Mother"
              />
            </div>

            <div>
              <Label htmlFor="emergency_phone">Phone Number</Label>
              <Input
                id="emergency_phone"
                type="tel"
                value={
                  isEditing
                    ? formData.emergency_contact?.phone
                    : profile.emergency_contact?.phone || ''
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergency_contact: { ...formData.emergency_contact, phone: e.target.value },
                  })
                }
                disabled={!isEditing}
              />
            </div>
          </div>
        </Card>

        {/* Academic Information (Read-only) */}
        <Card className="p-6 lg:col-span-3 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Academic Information (Read-only)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Roll Number</Label>
              <p className="mt-1 font-medium">{profile.roll_number}</p>
            </div>
            <div>
              <Label>Enrollment Number</Label>
              <p className="mt-1 font-medium">{profile.enrollment_number}</p>
            </div>
            <div>
              <Label>Academic Year</Label>
              <p className="mt-1 font-medium">{profile.academic_year}</p>
            </div>
            <div>
              <Label>Department</Label>
              <p className="mt-1 font-medium">{profile.department}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
