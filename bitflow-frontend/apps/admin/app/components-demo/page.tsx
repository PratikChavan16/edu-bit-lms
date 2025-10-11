'use client';

import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Alert,
  Spinner,
  Checkbox,
  Modal,
  Badge,
  Textarea,
  Select,
  RadioGroup,
} from '@bitflow/ui';

export default function ComponentsDemoPage() {
  const [showModal, setShowModal] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [radioValue, setRadioValue] = useState('');
  const [badges, setBadges] = useState(['Tag 1', 'Tag 2', 'Tag 3']);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Component Library Demo
          </h1>
          <p className="text-gray-600">
            Testing all components built for the EduBit LMS
          </p>
        </div>

        {/* Alert Component */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Component</CardTitle>
            <CardDescription>
              Display feedback messages with different variants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertVisible && (
              <Alert
                variant="success"
                title="Success!"
                closeable
                onClose={() => setAlertVisible(false)}
              >
                Your changes have been saved successfully.
              </Alert>
            )}
            <Alert variant="error" title="Error">
              Something went wrong. Please try again.
            </Alert>
            <Alert variant="warning">
              Your session will expire in 5 minutes.
            </Alert>
            <Alert variant="info" title="Info">
              New features are available. Check them out!
            </Alert>
            {!alertVisible && (
              <Button onClick={() => setAlertVisible(true)}>
                Show Success Alert Again
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Spinner Component */}
        <Card>
          <CardHeader>
            <CardTitle>Spinner Component</CardTitle>
            <CardDescription>Loading indicators in different sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <Spinner size="sm" />
                <p className="text-xs text-gray-600 mt-2">Small</p>
              </div>
              <div className="text-center">
                <Spinner size="md" />
                <p className="text-xs text-gray-600 mt-2">Medium</p>
              </div>
              <div className="text-center">
                <Spinner size="lg" />
                <p className="text-xs text-gray-600 mt-2">Large</p>
              </div>
              <div className="text-center">
                <Spinner size="xl" />
                <p className="text-xs text-gray-600 mt-2">Extra Large</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Component */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Component</CardTitle>
            <CardDescription>
              Tags and status indicators with variants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge: string, index: number) => (
                  <Badge
                    key={index}
                    variant="info"
                    removable
                    onRemove={() => {
                      setBadges(badges.filter((_: string, i: number) => i !== index));
                    }}
                  >
                    {badge}
                  </Badge>
                ))}
                <Button
                  size="sm"
                  onClick={() =>
                    setBadges([...badges, `Tag ${badges.length + 1}`])
                  }
                >
                  Add Tag
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal Component */}
        <Card>
          <CardHeader>
            <CardTitle>Modal Component</CardTitle>
            <CardDescription>Dialog boxes with backdrop</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowModal(true)}>Open Modal</Button>
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="Example Modal"
              footer={
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setShowModal(false)}>Confirm</Button>
                </>
              }
            >
              <p className="text-gray-600">
                This is a modal dialog. It can contain any content you want.
                Click outside, press ESC, or use the buttons to close it.
              </p>
            </Modal>
          </CardContent>
        </Card>

        {/* Form Components */}
        <Card>
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
            <CardDescription>
              Input, Textarea, Select, Checkbox, and Radio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              helperText="We'll never share your email."
              required
            />

            {/* Textarea */}
            <Textarea
              label="Description"
              placeholder="Enter your description..."
              rows={4}
              helperText="Describe your experience in detail."
            />

            {/* Select */}
            <Select
              label="Select Country"
              placeholder="Choose a country"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'ca', label: 'Canada' },
                { value: 'in', label: 'India' },
              ]}
              required
            />

            {/* Checkbox */}
            <Checkbox
              label="Accept terms and conditions"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
              helperText="You must accept the terms to continue."
              required
            />

            {/* Radio Group */}
            <RadioGroup
              label="Choose a plan"
              name="plan"
              value={radioValue}
              onChange={setRadioValue}
              options={[
                {
                  value: 'free',
                  label: 'Free',
                  helperText: 'Best for personal use',
                },
                {
                  value: 'pro',
                  label: 'Pro',
                  helperText: 'Best for professionals',
                },
                {
                  value: 'enterprise',
                  label: 'Enterprise',
                  helperText: 'Best for large teams',
                },
              ]}
            />

            <Button className="w-full">Submit Form</Button>
          </CardContent>
        </Card>

        {/* Button Component */}
        <Card>
          <CardHeader>
            <CardTitle>Button Component</CardTitle>
            <CardDescription>All button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="glass">Glass</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
