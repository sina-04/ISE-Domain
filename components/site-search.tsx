'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  careers,
  courses,
  pathways,
  type CareerProfile,
  type Course,
  type Pathway,
} from '@/lib/catalog';
import { categories, normalizeSearch, type Locale } from '@/lib/domain-config';
import { withBasePath } from '@/lib/base-path';

type SearchSuggestion = {
  value: string;
  label: string;
  secondary: string;
  kind: 'category' | 'course' | 'pathway' | 'career';
  href: string;
  keywords: string;
};

function localizedText(item: Course | Pathway | CareerProfile, locale: Locale) {
  return item.name[locale];
}

export function SiteSearch({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState('');
  const firstLetter = query.match(/[A-Za-z\u0600-\u06ff]/)?.[0];
  const resultLocale: Locale = firstLetter
    ? /[\u0600-\u06ff]/.test(firstLetter)
      ? 'fa'
      : 'en'
    : locale;
  const t = (en: string, per: string) => (locale === 'fa' ? per : en);
  const resultText = (en: string, per: string) =>
    resultLocale === 'fa' ? per : en;
  const suggestions: SearchSuggestion[] = [
    ...categories.map((category) => ({
      value: `category-${category.id}`,
      label: category.title[resultLocale],
      secondary: resultText('Knowledge field', 'حوزه دانش'),
      kind: 'category' as const,
      href: `/${locale}/chart?view=content&category=${category.id}`,
      keywords: `${category.title.en} ${category.title.fa} ${category.caption.en} ${category.caption.fa}`,
    })),
    ...courses
      .filter((course) => course.group !== 'supplementary')
      .map((course) => ({
        value: `course-${course.id}`,
        label: localizedText(course, resultLocale),
        secondary: course.code || resultText('Course', 'درس'),
        kind: 'course' as const,
        href: `/${locale}/chart?view=content&course=${course.id}`,
        keywords: `${course.name.en} ${course.name.fa} ${course.code || ''}`,
      })),
    ...pathways.map((pathway) => ({
      value: `pathway-${pathway.id}`,
      label: localizedText(pathway, resultLocale),
      secondary: resultText("Master's pathway", 'مسیر کارشناسی ارشد'),
      kind: 'pathway' as const,
      href: `/${locale}/majors?pathway=${pathway.id}`,
      keywords: `${pathway.name.en} ${pathway.name.fa} ${pathway.description.en} ${pathway.description.fa}`,
    })),
    ...careers.map((career) => ({
      value: `career-${career.id}`,
      label: localizedText(career, resultLocale),
      secondary: resultText('Career', 'مسیر شغلی'),
      kind: 'career' as const,
      href:
        career.id === 'data-science'
          ? `/${locale}/data-science`
          : `/${locale}/careers?career=${career.id}`,
      keywords: `${career.name.en} ${career.name.fa} ${career.summary.en} ${career.summary.fa}`,
    })),
  ];

  return (
    <div className="site-search">
      <Search size={17} aria-hidden="true" />
      <Combobox
        items={suggestions}
        itemToStringLabel={(item: SearchSuggestion) => item.label}
        itemToStringValue={(item: SearchSuggestion) => item.value}
        filter={(item: SearchSuggestion, query) =>
          normalizeSearch(`${item.label} ${item.keywords}`).includes(
            normalizeSearch(query),
          )
        }
        autoHighlight
        onInputValueChange={setQuery}
        onValueChange={(item: SearchSuggestion | null) => {
          if (item) window.location.href = withBasePath(item.href);
        }}
      >
        <ComboboxInput
          className="site-search-input"
          aria-label={t('Search topics', 'جست‌وجوی موضوعات')}
          placeholder={t('Search topics…', 'جست‌وجوی موضوع…')}
          lang={resultLocale}
          dir={resultLocale === 'fa' ? 'rtl' : 'ltr'}
          showTrigger={false}
          showClear
        />
        <ComboboxContent
          className="site-search-content"
          lang={resultLocale}
          dir={resultLocale === 'fa' ? 'rtl' : 'ltr'}
        >
          <ComboboxEmpty className="site-search-empty">
            {resultText('No matching topic', 'موضوعی پیدا نشد')}
          </ComboboxEmpty>
          <ComboboxList>
            <ComboboxCollection>
              {(item: SearchSuggestion) => (
                <ComboboxItem
                  key={item.value}
                  value={item}
                  className="site-search-item"
                >
                  <span className={`site-search-kind ${item.kind}`}>
                    {item.secondary}
                  </span>
                  <strong>{item.label}</strong>
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
