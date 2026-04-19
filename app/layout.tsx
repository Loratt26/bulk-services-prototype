import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bulk Services — Cowlendar Prototype · Brian Salazar',
  description:
    'Functional 5-step wizard prototype for bulk service creation in Cowlendar. Designed and built by Brian Salazar during feature validation at Penida.io.',
  robots: {index: false, follow: false},
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div
          style={{
            background: 'rgba(0, 210, 106, 0.08)',
            color: '#00A352',
            borderBottom: '1px solid rgba(0, 210, 106, 0.15)',
            padding: '8px 16px',
            fontSize: '12px',
            textAlign: 'center',
            fontFamily:
              'ui-monospace, SFMono-Regular, Monaco, Consolas, monospace',
            letterSpacing: '0.02em',
          }}
        >
          Prototype demo · Built by Brian Salazar for Penida.io
        </div>
        {children}
      </body>
    </html>
  );
}
