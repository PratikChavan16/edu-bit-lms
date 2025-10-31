'use client';

import { CollegeProvider } from '@/contexts/CollegeContext';
import { ReactNode, use } from 'react';

interface CollegeLayoutProps {
  children: ReactNode;
  params: Promise<{
    id: string;
    collegeId: string;
  }>;
}

export default function CollegeLayout({ children, params }: CollegeLayoutProps) {
  const { id, collegeId } = use(params);
  
  return (
    <CollegeProvider universityId={id} collegeId={collegeId}>
      {children}
    </CollegeProvider>
  );
}
