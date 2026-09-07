'use client';
import { useEffect } from 'react';
import Link from '@/components/site-link';
export default function Entry() {
  useEffect(() => {
    let locale = 'en';
    try {
      locale = localStorage.getItem('ise-language') === 'fa' ? 'fa' : 'en';
    } catch {}
    window.location.replace(`/${locale}`);
  }, []);
  return (
    <main className="entry">
      <Link href="/en">ISE DOMAIN · Enter / ورود</Link>
    </main>
  );
}
