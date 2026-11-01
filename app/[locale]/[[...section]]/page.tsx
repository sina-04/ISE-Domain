import { notFound } from 'next/navigation';
import { DomainApp } from '@/components/domain-app';
import type { Metadata } from 'next';

const locales = ['en', 'fa'] as const;
const sections = [
  'chart',
  'majors',
  'careers',
  'tools',
  'resources',
  'wikipedia',
  'data-science',
] as const;

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section?: string[] }>;
}): Promise<Metadata> {
  const { locale, section } = await params;
  const titles: Record<string, [string, string]> = {
    home: ['Overview', 'نمای کلی'],
    chart: ['Chart Analysis', 'تحلیل چارت'],
    majors: ['Master’s Majors', 'گرایش‌های کارشناسی ارشد'],
    careers: ['Career Guide', 'راهنمای شغلی'],
    tools: ['Tools & Software', 'ابزار و نرم‌افزار'],
    resources: ['Resources', 'منابع یادگیری'],
    wikipedia: ['Wikipedia References', 'مراجع ویکی‌پدیا'],
    'data-science': ['Data Science', 'علم داده'],
  };
  return {
    title:
      titles[section?.[0] || 'home']?.[locale === 'fa' ? 1 : 0] || 'ISE Domain',
  };
}

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
