import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TaskFlow — Manage with clarity',
  description: 'A beautiful, minimal task management system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15,15,25,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#f1f5f9',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#0f0f19' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#0f0f19' } },
          }}
        />
      </body>
    </html>
  );
}
