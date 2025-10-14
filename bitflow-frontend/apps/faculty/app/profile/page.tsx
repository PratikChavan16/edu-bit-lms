'use client';

import { useState } from 'react';
import { Button } from '@bitflow/ui/button';
import { Card } from '@bitflow/ui/card';
import { Badge } from '@bitflow/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. John Doe',
    email: 'john.doe@university.edu',
    phone: '+1 234 567 8900',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'Machine Learning, Data Science',
    qualification: 'Ph.D. in Computer Science',
    experience_years: 12,
    joining_date: '2012-08-15',
    office_location: 'Building A, Room 305',
    office_hours: 'Mon-Fri: 2:00 PM - 4:00 PM',
    bio: 'Passionate educator with expertise in machine learning and artificial intelligence.',
  });

  const handleSave = () => {
    // TODO: Implement API call to save profile
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Faculty Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-12 w-12 text-primary" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                className="text-2xl font-bold border-b mb-2 w-full"
              />
            ) : (
              <h2 className="text-2xl font-bold mb-2">{profileData.name}</h2>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline">{profileData.designation}</Badge>
              <Badge>{profileData.department}</Badge>
              <span className="text-sm text-muted-foreground">
                {profileData.experience_years} years experience
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                <p>{profileData.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                <p>{profileData.phone}</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Office Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.office_location}
                  onChange={e => setProfileData({ ...profileData, office_location: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                <p>{profileData.office_location}</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Office Hours</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.office_hours}
                  onChange={e => setProfileData({ ...profileData, office_hours: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                <p>{profileData.office_hours}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Academic Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Qualification</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.qualification}
                onChange={e => setProfileData({ ...profileData, qualification: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            ) : (
              <p className="mt-1">{profileData.qualification}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Specialization</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.specialization}
                onChange={e => setProfileData({ ...profileData, specialization: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            ) : (
              <p className="mt-1">{profileData.specialization}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Department</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.department}
                onChange={e => setProfileData({ ...profileData, department: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            ) : (
              <p className="mt-1">{profileData.department}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Joining Date</label>
            {isEditing ? (
              <input
                type="date"
                value={profileData.joining_date}
                onChange={e => setProfileData({ ...profileData, joining_date: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            ) : (
              <p className="mt-1">
                {new Date(profileData.joining_date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-muted-foreground">Bio</label>
          {isEditing ? (
            <textarea
              value={profileData.bio}
              onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
            />
          ) : (
            <p className="mt-1">{profileData.bio}</p>
          )}
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-2xl font-bold">156</div>
          <p className="text-sm text-muted-foreground">Total Students Taught</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">24</div>
          <p className="text-sm text-muted-foreground">Assessments Created</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">4.8/5</div>
          <p className="text-sm text-muted-foreground">Average Rating</p>
        </Card>
      </div>
    </div>
  );
}
