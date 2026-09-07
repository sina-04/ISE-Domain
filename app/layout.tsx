import type { Metadata } from 'next';
import { Barlow_Condensed, Manrope, Vazirmatn } from 'next/font/google';
import './globals.css';
const display = Barlow_Condensed({
  weight: ['500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-display',
});
const body = Manrope({ subsets: ['latin'], variable: '--font-body' });
const persian = Vazirmatn({ subsets: ['arabic'], variable: '--font-persian' });
export const metadata: Metadata = {
  title: {
    default: 'ISE Domain — Industrial & Systems Engineering',
    template: '%s | ISE Domain',
  },
  description:
    'Explore Industrial and Systems Engineering: courses, graduate pathways, tools and resources. In English and Persian.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang=location.pathname.startsWith('/fa')?'fa':'en';document.documentElement.dir=location.pathname.startsWith('/fa')?'rtl':'ltr';try{document.documentElement.dataset.theme=localStorage.getItem('ise-theme')||'dark'}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${persian.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
