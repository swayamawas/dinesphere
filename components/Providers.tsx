'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/context/AuthContext';

/**
 * Client-side providers wrapper.
 * SessionProvider must be a client component — we extract it here
 * so the root layout.tsx can remain a server component.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
