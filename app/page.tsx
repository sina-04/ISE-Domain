'use client';
import { useEffect } from 'react';
import { withBasePath } from '@/lib/base-path';
export default function Entry() {
  useEffect(() => {
    let locale = 'en';
    try {
      locale = localStorage.getItem('ise-language') === 'fa' ? 'fa' : 'en';
    } catch {}
    window.location.replace(withBasePath(`/${locale}`));
  }, []);
  return (
    <main className="entry">
      <output
        className="entry-loader"
        aria-label="Loading ISE Domain / در حال بارگذاری"
      >
        <span className="entry-loader-orbit" aria-hidden="true" />
        <span className="entry-loader-core" aria-hidden="true" />
      </output>
    </main>
  );
}
