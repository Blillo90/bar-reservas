import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bar Reservas — Panel de Gestión',
  description: 'Sistema de gestión de reservas para bar de copas. Añade y consulta reservas de forma rápida e intuitiva.',
};

/**
 * Inline script injected before hydration to avoid flash of wrong theme.
 * Reads localStorage first, then falls back to system preference.
 */
const THEME_SCRIPT = `
try {
  var t = localStorage.getItem('bar-theme');
  var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.classList.add('dark');
} catch(e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Must run before body renders to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
