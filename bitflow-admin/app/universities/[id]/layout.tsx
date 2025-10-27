'use client';

import { UniversityProvider } from '@/contexts/UniversityContext';
import { ReactNode } from 'react';

interface UniversityLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

export default function UniversityLayout({ children, params }: UniversityLayoutProps) {
  return (
    <UniversityProvider universityId={params.id}>
      {children}
    </UniversityProvider>
  );
}
