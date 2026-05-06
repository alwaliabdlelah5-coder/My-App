import { Inter, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: "IMP - Integrated Medical Platform",
  description: "Advanced medical command center for Web, Android, and Windows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
