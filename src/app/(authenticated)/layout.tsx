import DefaultLayout from '@/src/components/layouts/DefaultLayout';
import AuthProvider from '@/src/providers/Auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DefaultLayout>{children}</DefaultLayout>
    </AuthProvider>
  );
}

RootLayout.requireAuth = true;
