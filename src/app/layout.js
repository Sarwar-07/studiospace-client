import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'StudioSpace | Creative Workspace Marketplace',
  description: 'Discover and book photo studios, sound stages, recording booths, and art workspaces.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors duration-200 flex flex-col`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}