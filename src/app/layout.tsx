import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@src/styles/globals.scss';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';

import { Metadata } from 'next';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/src/styles/theme';
import ClientProvider from '../providers/Client';
import NextAuthProvider from '../providers/Session';
import { fontClass } from '../styles/font';

export const metadata: Metadata = {
  title: 'Jannt and Sadaf Admin Panel',
  description: 'Admin panel for Jannt and Sadaf',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={fontClass}>
        <ClientProvider>
          <MantineProvider theme={theme}>
            <Notifications />
            {children}
          </MantineProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
