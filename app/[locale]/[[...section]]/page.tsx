import { notFound } from 'next/navigation';
import { DomainApp } from '@/components/domain-app';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; section?: string[] }>;
}) {
  const { locale, section } = await params;
  if (
    !['en', 'fa'].includes(locale) ||
    (section &&
      (section.length > 1 ||
        !['chart', 'majors', 'tools', 'resources', 'wikipedia'].includes(
          section[0],
        )))
  )
    notFound();
  return (
    <DomainApp
      locale={locale as 'en' | 'fa'}
      section={section?.[0] || 'home'}
    />
  );
}
