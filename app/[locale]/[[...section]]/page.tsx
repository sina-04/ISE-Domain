import { notFound } from 'next/navigation';
import { DomainApp } from '@/components/domain-app';

const locales = ['en', 'fa'] as const;
const sections = [
  'chart',
  'majors',
  'careers',
  'tools',
  'resources',
  'wikipedia',
] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => [
    { locale, section: [] as string[] },
    ...sections.map((section) => ({ locale, section: [section] })),
  ]);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; section?: string[] }>;
}) {
  const { locale, section } = await params;
  if (
    !locales.includes(locale as (typeof locales)[number]) ||
    (section &&
      (section.length > 1 ||
        !sections.includes(section[0] as (typeof sections)[number])))
  )
    notFound();
  return (
    <DomainApp
      locale={locale as 'en' | 'fa'}
      section={section?.[0] || 'home'}
    />
  );
}
