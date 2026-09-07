'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Entry() {
  const router = useRouter();
  useEffect(() => {
    let locale = 'en';
    try {
      locale = localStorage.getItem('ise-language') === 'fa' ? 'fa' : 'en';
    } catch {}
    router.replace(`/${locale}`);
  }, [router]);
  return (
    <main className="entry">
      <Link href="/en">ISE DOMAIN · Enter / ورود</Link>
    </main>
  );
}
