import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'النظام الطبي المتكامل (IMP)',
  description: 'نظام طبي متكامل لإدارة المؤسسات الطبية',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="font-cairo antialiased bg-gray-50 text-gray-900" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
