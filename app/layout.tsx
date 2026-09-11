import type { Metadata } from 'next';
import { Barlow_Condensed, Manrope } from 'next/font/google';
import './globals.css';
const display = Barlow_Condensed({
  weight: ['500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-latin-display',
});
const body = Manrope({ subsets: ['latin'], variable: '--font-latin-body' });
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const persianFontFaces = `
@font-face{font-family:'Vazirmatn Persian Digits';src:url('${publicBasePath}/fonts/Vazirmatn-wght.woff2') format('woff2');font-weight:100 900;font-style:normal;font-display:swap;unicode-range:U+06F0-06F9}
@font-face{font-family:'Sahel';src:url('${publicBasePath}/fonts/Sahel.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Sahel';src:url('${publicBasePath}/fonts/Sahel-SemiBold.woff2') format('woff2');font-weight:600;font-style:normal;font-display:swap}
@font-face{font-family:'Sahel';src:url('${publicBasePath}/fonts/Sahel-Bold.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:'Sahel';src:url('${publicBasePath}/fonts/Sahel-Black.woff2') format('woff2');font-weight:900;font-style:normal;font-display:swap}
`;
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
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: persianFontFaces }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `const fa=/(?:^|\\/)fa(?:\\/|$)/.test(location.pathname);document.documentElement.lang=fa?'fa':'en';document.documentElement.dir=fa?'rtl':'ltr';try{document.documentElement.dataset.theme=localStorage.getItem('ise-theme')||'dark'}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
