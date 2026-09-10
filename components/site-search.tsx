'use client';

import { Search } from 'lucide-react';
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
  const fa = locale === 'fa';
  const t = (en: string, per: string) => (fa ? per : en);
  const suggestions: SearchSuggestion[] = [
    ...categories.map((category) => ({
      value: `category-${category.id}`,
      label: category.title[locale],
      secondary: t('Knowledge field', 'حوزه دانش'),
      kind: 'category' as const,
      href: `/${locale}/chart?view=content&category=${category.id}`,
      keywords: `${category.title.en} ${category.title.fa} ${category.caption.en} ${category.caption.fa}`,
    })),
    ...courses
      .filter((course) => course.group !== 'supplementary')
      .map((course) => ({
        value: `course-${course.id}`,
        label: localizedText(course, locale),
        secondary: course.code || t('Course', 'درس'),
        kind: 'course' as const,
        href: `/${locale}/chart?view=content&course=${course.id}`,
        keywords: `${course.name.en} ${course.name.fa} ${course.code || ''}`,
      })),
    ...pathways.map((pathway) => ({
      value: `pathway-${pathway.id}`,
      label: localizedText(pathway, locale),
      secondary: t("Master's pathway", 'مسیر کارشناسی ارشد'),
      kind: 'pathway' as const,
      href: `/${locale}/majors?pathway=${pathway.id}`,
      keywords: `${pathway.name.en} ${pathway.name.fa} ${pathway.description.en} ${pathway.description.fa}`,
    })),
    ...careers.map((career) => ({
      value: `career-${career.id}`,
      label: localizedText(career, locale),
      secondary: t('Career', 'مسیر شغلی'),
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
        onValueChange={(item: SearchSuggestion | null) => {
          if (item) window.location.href = withBasePath(item.href);
        }}
      >
        <ComboboxInput
          className="site-search-input"
          aria-label={t('Search topics', 'جست‌وجوی موضوعات')}
          placeholder={t('Search topics…', 'جست‌وجوی موضوع…')}
          showTrigger={false}
          showClear
        />
        <ComboboxContent className="site-search-content">
          <ComboboxEmpty className="site-search-empty">
            {t('No matching topic', 'موضوعی پیدا نشد')}
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
