'use client';

import { UniversityProvider } from '@/contexts/UniversityContext';
import { ReactNode, use } from 'react';

interface UniversityLayoutProps {
  children: ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export default function UniversityLayout({ children, params }: UniversityLayoutProps) {
  const { id } = use(params);
  
  return (
    <UniversityProvider universityId={id}>
      {children}
    </UniversityProvider>
  );
}
