import UnAuthProvider from '@/src/providers/Unauth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <UnAuthProvider>
      <>{children}</>
    </UnAuthProvider>
  );
}

RootLayout.requireAuth = true;
