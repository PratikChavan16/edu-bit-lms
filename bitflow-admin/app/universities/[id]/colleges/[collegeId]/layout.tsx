'use client';

import { CollegeProvider } from '@/contexts/CollegeContext';
import { ReactNode } from 'react';

interface CollegeLayoutProps {
  children: ReactNode;
  params: {
    id: string;
    collegeId: string;
  };
}

export default function CollegeLayout({ children, params }: CollegeLayoutProps) {
  return (
    <CollegeProvider universityId={params.id} collegeId={params.collegeId}>
      {children}
    </CollegeProvider>
  );
}
