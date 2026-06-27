import Providers from '@components/Providers';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-us">
      <body className="theme-light">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
