import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bar Reservas — Panel de Gestión',
  description: 'Sistema de gestión de reservas para bar de copas. Añade y consulta reservas de forma rápida e intuitiva.',
};

/**
 * Apply dark theme immediately before hydration to avoid flash.
 * The actual theme value is read from bar_settings (Supabase) once the app loads.
 * Dark is the default while settings are being fetched.
 */
const THEME_SCRIPT = `document.documentElement.classList.add('dark');`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
