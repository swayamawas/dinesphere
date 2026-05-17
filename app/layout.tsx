import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import './globals.css';

import AuthModal from '@/components/AuthModal';

export const metadata = {
  title: 'DineSphere',
  description: 'Restaurant Discovery & Reservation Platform'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <AuthModal />
        </Providers>
      </body>
    </html>
  );
}
