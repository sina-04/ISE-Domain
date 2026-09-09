'use client';
/* Supplied SVGs are intentionally preserved as SVGs, without raster optimization. */
/* eslint-disable @next/next/no-img-element */
import { useState, useSyncExternalStore, type CSSProperties } from 'react';
import Link from '@/components/site-link';
import {
  Search,
  ArrowUpRight,
  ArrowRight,
  X,
  BookOpen,
  GraduationCap,
  SlidersHorizontal,
  Layers3,
  Info,
  Code2,
  ChevronRight,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  categories,
  officialGroups,
  normalizeSearch,
  type Locale,
  type Text,
} from '@/lib/domain-config';
import {
  courses,
  undergraduate,
  pathways,
  tools,
  courseById,
  careerById,
  careerDomains,
  creditsFor,
  formatNumber,
  courseMatches,
  type Course,
  type CareerProfile,
} from '@/lib/catalog';
import {
  resources,
  resourcesForCourse,
  type Resource,
} from '@/lib/resources';
import { withBasePath } from '@/lib/base-path';
import { CareerGuide } from '@/components/career-guide';
const pageNames: Record<string, Text> = {
  chart: { en: 'CHART ANALYSIS', fa: 'تحلیل چارت' },
  majors: { en: 'FIND YOUR DIRECTION', fa: 'مسیر خود را پیدا کنید' },
  tools: { en: 'YOUR ENGINEERING TOOLKIT', fa: 'جعبه‌ابزار مهندسی شما' },
  resources: { en: 'KEEP EXPLORING', fa: 'به کاوش ادامه دهید' },
  wikipedia: { en: 'FOLLOW THE KNOWLEDGE', fa: 'دانش را دنبال کنید' },
  careers: { en: 'CAREER GUIDE', fa: 'راهنمای مسیر شغلی' },
};
const pageDescriptions: Record<string, Text> = {
  chart: {
    en: 'One curriculum. Three ways to understand it. Explore the subjects, connections and possibilities behind your degree.',
    fa: 'یک برنامه درسی؛ سه راه برای شناخت آن. موضوعات، ارتباط‌ها و فرصت‌های رشته خود را کشف کنید.',
  },
  majors: {
    en: 'Connect what you study today to the systems you could shape tomorrow.',
    fa: 'آنچه امروز می‌آموزید را به سیستم‌هایی پیوند دهید که فردا می‌توانید تغییر دهید.',
  },
  tools: {
    en: 'From your first spreadsheet to a complete simulation. Find the tools that turn theory into practice.',
    fa: 'از نخستین صفحه‌گسترده تا یک شبیه‌سازی کامل؛ ابزارهایی را بیابید که نظریه را به عمل تبدیل می‌کنند.',
  },
  resources: {
    en: 'Good questions deserve good sources. Start with books, official guides and ideas worth following.',
    fa: 'پرسش‌های خوب، منابع خوب می‌خواهند. از کتاب‌ها، راهنماهای رسمی و ایده‌های ارزشمند شروع کنید.',
  },
  wikipedia: {
    en: 'A starting point for curiosity. Explore verified articles related to each course in English and Persian.',
    fa: 'نقطه آغاز کنجکاوی؛ مقاله‌های تأییدشده مرتبط با هر درس را به انگلیسی و فارسی کاوش کنید.',
  },
  careers: {
    en: 'See where Industrial and Systems Engineering can take you—and what to build next for each direction.',
    fa: 'ببینید مهندسی صنایع و سیستم‌ها شما را به کجا می‌برد و برای هر مسیر چه توانمندی‌هایی باید بسازید.',
  },
};
function FilterSelect({
  value,
  label,
  options,
  onValueChange,
  withIcon = false,
}: {
  value: string;
  label: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  withIcon?: boolean;
}) {
  return (
    <div className="select-filter">
      {withIcon && <SlidersHorizontal size={16} aria-hidden="true" />}
      <Select
        value={value}
        onValueChange={(next) => {
          if (next !== null) onValueChange(String(next));
        }}
      >
        <SelectTrigger className="filter-select-trigger" aria-label={label}>
          <SelectValue>
            {options.find((option) => option.value === value)?.label || value}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          className="filter-select-content"
          align="start"
          sideOffset={8}
        >
          {options.map((option) => (
            <SelectItem
              className="filter-select-item"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
function OutLink({
  href,
  children,
  className = '',
  lang,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  lang?: string;
}) {
  return (
    <a
      href={withBasePath(href)}
      target="_blank"
      rel="noopener noreferrer"
      className={`out-link ${className}`}
      lang={lang}
    >
      {children}
      <ArrowUpRight size={15} />
    </a>
  );
}

function ResourceConnections({
  resource,
  basis,
  locale,
}: {
  resource: Resource;
  basis: string;
  locale: Locale;
}) {
  if (basis === 'majors') {
    return (
      <div className="resource-subjects">
        {resource.pathwayIds?.map((id) => {
          const pathway = pathways.find((item) => item.id === id);
          return pathway ? (
            <Link
              key={id}
              href={`/${locale}/chart?view=pathways&pathway=${id}`}
            >
              {pathway.name[locale]}
            </Link>
          ) : null;
        })}
      </div>
    );
  }

  if (basis === 'careers') {
    return (
      <div className="resource-subjects">
        {resource.careerIds?.map((id) => {
          const career = careerById[id];
          return career ? (
            <Link key={id} href={`/${locale}/careers?career=${id}`}>
              {career.name[locale]}
            </Link>
          ) : null;
        })}
      </div>
    );
  }

  return (
    <div className="resource-subjects">
      {resource.categories.map((id) => {
        const category = categories.find((item) => item.id === id);
        return category ? (
          <Link
            key={id}
            href={`/${locale}/chart?view=content&category=${id}`}
          >
            {category.title[locale]}
          </Link>
        ) : null;
      })}
    </div>
  );
}
const subscribeQuery = (listener: () => void) => {
  window.addEventListener('popstate', listener);
  window.addEventListener('ise-querychange', listener);
  return () => {
    window.removeEventListener('popstate', listener);
    window.removeEventListener('ise-querychange', listener);
  };
};
const readQuery = () => window.location.search;
export function Explorer({
  locale,
  section,
}: {
  locale: Locale;
  section: string;
}) {
  const t = (en: string, fa: string) => (locale === 'fa' ? fa : en);
  const num = (n: number) => formatNumber(n, locale);
  const searchString = useSyncExternalStore(
    subscribeQuery,
    readQuery,
    () => '',
  );
  const params = new URLSearchParams(searchString);
  const query = params.get('q') || '';
  const view = ['official', 'content', 'pathways'].includes(
    params.get('view') || '',
  )
    ? params.get('view')!
    : 'official';
  const category = params.get('category') || 'all';
  const pathway = params.get('pathway') || 'all';
  const group = params.get('group') || 'all';
  const resourceBasis = params.get('based') || 'all';
  const resourceScope = params.get('scope') || 'all';
  const search = query;
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  const update = (values: Record<string, string | null>) => {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(values)) {
      if (value && value !== 'all') next.set(key, value);
      else next.delete(key);
    }
    window.history.replaceState(
      window.history.state,
      '',
      withBasePath(
        `/${locale}/${section}${next.size ? '?' + next.toString() : ''}`,
      ),
    );
    window.dispatchEvent(new Event('ise-querychange'));
  };
  const selected = courseById[params.get('course') || ''];
  const selectedCareer = careerById[params.get('career') || ''];
  const selectedCat = categories.find((c) => c.id === category);
  const open = (c: Course) => {
    if (!selected) setReturnFocus(document.activeElement as HTMLElement);
    update({ course: c.id });
  };
  const openCareer = (career: CareerProfile) => {
    if (!selectedCareer) setReturnFocus(document.activeElement as HTMLElement);
    update({ career: career.id });
  };
  const matching = undergraduate.filter((c) => courseMatches(c, query));
  const catCourses = (id: string) =>
    matching.filter((c) =>
      id === 'unmapped' ? c.categories.length === 0 : c.categories.includes(id),
    );
  const totalMatched = matching.filter((c) =>
    view === 'content'
      ? category === 'all' ||
        (category === 'unmapped'
          ? c.categories.length === 0
          : c.categories.includes(category))
      : view === 'official'
        ? group === 'all' || c.group === group
        : pathway === 'all' || c.pathwayIds.includes(pathway),
  );
  const searchBar = (
    <form
      className="search-form"
      onSubmit={(e) => {
        e.preventDefault();
        update({ q: search });
      }}
    >
      <Search size={18} />
      <input
        aria-label={t(
          'Search in English or Persian',
          'جست‌وجو به فارسی یا انگلیسی',
        )}
        value={search}
        onChange={(e) => {
          update({ q: e.target.value });
        }}
        placeholder={
          section === 'tools'
            ? t('Search tools or a course…', 'نام ابزار یا درس…')
            : section === 'resources'
              ? t(
                  'Search books, guides and resources…',
                  'جست‌وجوی کتاب، راهنما و منابع…',
                )
              : t(
                  'Search a course in English or Persian…',
                  'جست‌وجوی درس به فارسی یا انگلیسی…',
                )
        }
      />
      {search && (
        <button
          type="button"
          className="icon-button"
          onClick={() => {
            update({ q: null });
          }}
          aria-label={t('Clear search', 'پاک کردن جست‌وجو')}
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
  const courseRow = (c: Course) => (
    <button className="course-row" key={c.id} onClick={() => open(c)}>
      <span className="course-code" dir="ltr">
        {c.code || '—'}
      </span>
      <span className="course-name">
        <strong>{c.name[locale]}</strong>
        <small
          lang={locale === 'en' ? 'fa' : 'en'}
          dir={locale === 'en' ? 'rtl' : 'ltr'}
        >
          {c.name[locale === 'en' ? 'fa' : 'en']}
        </small>
        <span
          className={`card-resource-badge course-resource-badge ${resourcesForCourse(c.id).length ? 'has-resources' : ''}`}
        >
          <BookOpen size={13} aria-hidden="true" />
          {t('Resources', 'منابع')}
          {resourcesForCourse(c.id).length > 0 && (
            <small>{num(resourcesForCourse(c.id).length)}</small>
          )}
        </span>
      </span>
      <span className="course-credit">
        {num(c.credits)}
        <small>{t('cr.', 'واحد')}</small>
      </span>
      <ChevronRight size={16} />
    </button>
  );
  const noResults = (
    <div className="empty-state">
      <Search size={28} />
      <h3>{t('No matches yet', 'نتیجه‌ای پیدا نشد')}</h3>
      <p>
        {t(
          'Try a different spelling or clear your filters.',
          'املای دیگری را امتحان کنید یا فیلترها را پاک کنید.',
        )}
      </p>
      <button
        className="secondary-button"
        onClick={() => {
          update({
            q: null,
            category: null,
            group: null,
            pathway: null,
            type: null,
            topic: null,
            based: null,
            scope: null,
          });
        }}
      >
        {t('Reset filters', 'پاک کردن فیلترها')}
      </button>
    </div>
  );
  const matchesResourceBasis = (resource: Resource) => {
    if (resourceBasis === 'content') {
      return (
        resource.categories.length > 0 &&
        (resourceScope === 'all' ||
          resource.categories.includes(resourceScope))
      );
    }
    if (resourceBasis === 'majors') {
      return (
        (resource.pathwayIds?.length || 0) > 0 &&
        (resourceScope === 'all' ||
          resource.pathwayIds?.includes(resourceScope))
      );
    }
    if (resourceBasis === 'careers') {
      return (
        (resource.careerIds?.length || 0) > 0 &&
        (resourceScope === 'all' ||
          resource.careerIds?.some(
            (id) => careerById[id]?.domainId === resourceScope,
          ))
      );
    }
    return true;
  };
  return (
    <>
      <div className="page-heading">
        <Link className="breadcrumb" href={`/${locale}`}>
          {t('Overview', 'نمای کلی')}
          <ChevronRight size={13} />
          <span>{t('Explore', 'کاوش')}</span>
        </Link>
        <p className="overline">ISE DOMAIN / {section.toUpperCase()}</p>
        <h1>
          {pageNames[section][locale]}
          <span className="heading-dot">.</span>
        </h1>
        <p>{pageDescriptions[section][locale]}</p>
      </div>
      {section === 'chart' && (
        <Tabs
          value={view}
          onValueChange={(next) =>
            update({
              view: String(next),
              category: null,
              group: null,
              pathway: null,
            })
          }
          className="curriculum-tabs"
        >
          <TabsList
            variant="line"
            className="view-tabs"
            aria-label={t('Curriculum view', 'نمای برنامه درسی')}
          >
            {[
              ['official', 'Official classification', 'طبقه‌بندی رسمی'],
              ['content', 'Content categories', 'دسته‌بندی محتوایی'],
              ['pathways', 'Pathways & careers', 'گرایش‌ها و بازار کار'],
            ].map(([id, en, fa]) => (
              <TabsTrigger
                value={id}
                key={id}
                className={view === id ? 'selected' : ''}
              >
                <Layers3 size={16} />
                {t(en, fa)}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="explorer-toolbar">
            {searchBar}
            <FilterSelect
              withIcon
              label={t('Filter courses', 'فیلتر دروس')}
              value={
                view === 'content'
                  ? category
                  : view === 'official'
                    ? group
                    : pathway
              }
              onValueChange={(next) =>
                update({
                  [view === 'content'
                    ? 'category'
                    : view === 'official'
                      ? 'group'
                      : 'pathway']: next,
                })
              }
              options={[
                {
                  value: 'all',
                  label: t(
                    'All ' + (view === 'pathways' ? 'pathways' : 'categories'),
                    'همه دسته‌ها',
                  ),
                },
                ...(view === 'content'
                  ? [
                      ...categories,
                      {
                        id: 'unmapped',
                        title: {
                          en: 'Not yet grouped',
                          fa: 'هنوز دسته‌بندی نشده',
                        },
                      },
                    ]
                  : view === 'official'
                    ? officialGroups
                    : pathways.map((p) => ({ id: p.id, title: p.name }))
                ).map((c) => ({ value: c.id, label: c.title[locale] })),
              ]}
            />
          </div>
          <TabsContent value={view}>
            {view === 'official' && (
              <>
                <div className="degree-summary">
                  <div>
                    <strong>{num(140)}</strong>
                    <span>
                      {t('credits to graduate', 'واحد برای دانش‌آموختگی')}
                    </span>
                  </div>
                  <div className="degree-segments">
                    {officialGroups.map((g, i) => (
                      <button
                        key={g.id}
                        onClick={() =>
                          update({ group: group === g.id ? null : g.id })
                        }
                        style={
                          {
                            '--segment-color': [
                              '#afa0ff',
                              '#699ef2',
                              '#ce9bd8',
                              '#75bdb6',
                              '#d6bb83',
                              '#df879d',
                            ][i],
                            flex: g.credits,
                          } as CSSProperties
                        }
                        aria-label={`${g.title[locale]}: ${num(g.credits)}`}
                      >
                        <span />
                        <small>{num(g.credits)}</small>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="source-note">
                  <Info size={15} />
                  {t(
                    'Excel catalog · 66 mandatory credits + 3 project credits. Choose 22 credits from the elective pool; its full list is not a graduation total.',
                    'فهرست اکسل · ۶۶ واحد تخصصی الزامی + ۳ واحد پروژه. از مجموعه انتخابی، ۲۲ واحد انتخاب می‌شود؛ جمع گزینه‌ها، تعداد واحد لازم برای فراغت از تحصیل نیست.',
                  )}
                </p>
              </>
            )}
            {view === 'content' && (
              <p className="source-note">
                <Info size={15} />
                {t(
                  'Subject groups can overlap. Accounting belongs to both finance and management; overall counts include each course once. Courses outside the supplied groups remain visible below.',
                  'گروه‌های موضوعی می‌توانند هم‌پوشانی داشته باشند. حسابداری در مالی و مدیریت آمده است؛ هر درس در شمارش کل فقط یک بار لحاظ می‌شود. دروس خارج از گروه‌های ارائه‌شده در پایین قابل مشاهده‌اند.',
                )}
              </p>
            )}
            {view === 'pathways' && (
              <p className="source-note">
                <Info size={15} />
                {t(
                  'Workbook-based course connections and illustrative careers, not a definitive list of accredited degree titles. Supplementary healthcare courses do not count toward the 140-credit degree.',
                  'ارتباط درس‌ها و نمونه نقش‌های شغلی بر اساس کاربرگ است و فهرست قطعی عناوین مصوب ارشد نیست. دروس تکمیلی سلامت جزو دوره ۱۴۰ واحدی نیستند.',
                )}
              </p>
            )}
            <div className="results-meta" aria-live="polite">
              <span>
                {num(totalMatched.length)}{' '}
                {t('undergraduate courses', 'درس کارشناسی')}
              </span>
              <span>
                {t(
                  'Select a course to see its connections',
                  'برای دیدن ارتباط‌ها، درس را انتخاب کنید',
                )}
              </span>
            </div>
            {view === 'official' &&
              officialGroups
                .filter((g) => group === 'all' || g.id === group)
                .map((g) => {
                  const list = matching.filter((c) => c.group === g.id);
                  return (
                    list.length > 0 && (
                      <section className="course-group" key={g.id}>
                        <div className="group-heading">
                          <h2>{g.title[locale]}</h2>
                          <span>
                            {num(list.length)} {t('courses', 'درس')} <b>·</b>{' '}
                            {num(g.credits)}{' '}
                            {t('required credits', 'واحد مورد نیاز')}
                          </span>
                        </div>
                        <div className="course-list">{list.map(courseRow)}</div>
                        {g.id === 'elective' && (
                          <p className="group-footnote">
                            {t(
                              'Available elective pool:',
                              'جمع واحد گزینه‌های انتخابی:',
                            )}{' '}
                            {num(
                              creditsFor(
                                undergraduate.filter(
                                  (c) => c.group === 'elective',
                                ),
                              ),
                            )}{' '}
                            {t(
                              'credits. Complete 22, subject to your university’s offering and rules.',
                              'واحد. مطابق ارائه و مقررات دانشگاه، ۲۲ واحد انتخاب کنید.',
                            )}
                          </p>
                        )}
                      </section>
                    )
                  );
                })}
            {view === 'content' &&
              [
                ...categories,
                {
                  id: 'unmapped',
                  title: { en: 'Not yet grouped', fa: 'هنوز دسته‌بندی نشده' },
                  asset: '',
                  position: 'center',
                  mobilePosition: 'center',
                  color: '#b6b9cf',
                  number: '+',
                },
              ]
                .filter((c) => category === 'all' || c.id === category)
                .map((cat) => {
                  const list = catCourses(cat.id);
                  const mandatory = list.filter((c) => c.group !== 'elective');
                  const elective = list.filter((c) => c.group === 'elective');
                  return (
                    list.length > 0 && (
                      <section
                        className="course-group content-group"
                        key={cat.id}
                      >
                        <div
                          className="category-banner"
                          style={
                            {
                              '--category-color': cat.color,
                              '--image-position': cat.position,
                              '--mobile-position': cat.mobilePosition,
                            } as CSSProperties
                          }
                        >
                          {cat.asset && (
                            <img
                              src={withBasePath(cat.asset)}
                              alt=""
                              loading="lazy"
                              className="category-art"
                            />
                          )}
                          <div className="card-shade" />
                          <h2>{cat.title[locale]}</h2>
                          <p>
                            {num(list.length)} {t('courses', 'درس')}{' '}
                            <span> / </span>
                            {num(creditsFor(mandatory))}{' '}
                            {t('required', 'الزامی')} {t('+', '+')}{' '}
                            {num(creditsFor(elective))}{' '}
                            {t('elective credits', 'واحد انتخابی')}
                          </p>
                        </div>
                        <div className="course-list">{list.map(courseRow)}</div>
                      </section>
                    )
                  );
                })}
            {view === 'pathways' &&
              pathways
                .filter((p) => pathway === 'all' || p.id === pathway)
                .map((p) => {
                  const list = courses.filter(
                    (c) =>
                      p.courseIds.includes(c.id) && courseMatches(c, query),
                  );
                  return (
                    list.length > 0 && (
                      <section className="course-group" key={p.id}>
                        <div className="group-heading">
                          <h2>{p.name[locale]}</h2>
                          <span>
                            {p.supporting
                              ? t('Supporting skills', 'مهارت‌های پشتیبان')
                              : t('Pathway', 'مسیر')}
                          </span>
                        </div>
                        <p className="group-intro">{p.description[locale]}</p>
                        <p className="career-line">{p.careers[locale]}</p>
                        <div className="course-list">{list.map(courseRow)}</div>
                      </section>
                    )
                  );
                })}
            {(view === 'pathways'
              ? courses.filter(
                  (c) =>
                    courseMatches(c, query) &&
                    (pathway === 'all'
                      ? c.pathwayIds.length > 0
                      : c.pathwayIds.includes(pathway)),
                ).length
              : totalMatched.length) === 0 && noResults}
          </TabsContent>
        </Tabs>
      )}
      {section === 'careers' && (
        <CareerGuide
          locale={locale}
          selectedCareer={selectedCareer}
          returnFocus={returnFocus}
          alternateUrl={`/${locale === 'en' ? 'fa' : 'en'}/${section}${searchString}`}
          onOpen={openCareer}
          onClose={() => update({ career: null })}
        />
      )}
      {section === 'majors' && (
        <>
          <p className="source-note">
            <Info size={16} />
            {t(
              'Seven pathways from your workbook. Course connections are guidance; official degree names and admission requirements vary by institution.',
              'هفت مسیر از کاربرگ شما. ارتباط درس‌ها جنبه راهنما دارد؛ نام رسمی گرایش و شرایط پذیرش به دانشگاه وابسته است.',
            )}
          </p>
          <div className="pathway-grid">
            {pathways
              .filter((p) => !p.supporting)
              .map((p, i) => (
                <article className="pathway-card" key={p.id}>
                  <div className="pathway-card-top">
                    <span className="pathway-number">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <GraduationCap size={25} />
                  </div>
                  <h2>{p.name[locale]}</h2>
                  <p>{p.description[locale]}</p>
                  <dl>
                    <dt>{t('Skills you build', 'مهارت‌های شما')}</dt>
                    <dd>{p.skills[locale]}</dd>
                    <dt>{t('Where it can lead', 'نمونه نقش‌های شغلی')}</dt>
                    <dd>{p.careers[locale]}</dd>
                  </dl>
                  <div className="course-chips">
                    {p.courseIds.slice(0, 3).map((id) => (
                      <button key={id} onClick={() => open(courseById[id])}>
                        {courseById[id].name[locale]}
                      </button>
                    ))}
                  </div>
                  <div className="pathway-tools">
                    <Code2 size={14} />
                    {tools
                      .filter((tool) =>
                        tool.courseIds.some((id) => p.courseIds.includes(id)),
                      )
                      .slice(0, 4)
                      .map((tool) => tool.name)
                      .join(' · ')}
                  </div>
                  <Link
                    className="text-link"
                    href={`/${locale}/chart?view=pathways&pathway=${p.id}`}
                  >
                    {t('Explore', 'کاوش')} {num(p.courseIds.length)}{' '}
                    {t('connected courses', 'درس مرتبط')}
                    <ArrowRight size={16} />
                  </Link>
                </article>
              ))}
          </div>
          <div className="section-heading supporting-title">
            <div>
              <p className="overline">
                {t('ACROSS EVERY PATH', 'در تمام مسیرها')}
              </p>
              <h2>{t('SHARED STRENGTHS', 'توانمندی‌های مشترک')}</h2>
            </div>
          </div>
          <div className="supporting-grid">
            {pathways
              .filter((p) => p.supporting)
              .map((p) => (
                <Link
                  className="module-card"
                  href={`/${locale}/chart?view=pathways&pathway=${p.id}`}
                  key={p.id}
                >
                  <Layers3 size={24} />
                  <h3>{p.name[locale]}</h3>
                  <p>{p.description[locale]}</p>
                  <ArrowUpRight size={18} />
                </Link>
              ))}
          </div>
        </>
      )}
      {section === 'tools' && (
        <>
          <div className="explorer-toolbar">
            {searchBar}
            <FilterSelect
              label={t('Filter by pathway', 'فیلتر بر اساس مسیر')}
              value={pathway}
              onValueChange={(next) => update({ pathway: next })}
              options={[
                { value: 'all', label: t('All pathways', 'همه مسیرها') },
                ...pathways.map((p) => ({
                  value: p.id,
                  label: p.name[locale],
                })),
              ]}
            />
          </div>
          <p className="source-note">
            {t(
              'Tools from the workbook, linked to their official providers. Combined entries are separated by product; availability and licensing are described on the provider’s site.',
              'ابزارهای کاربرگ با پیوند به ارائه‌دهندگان رسمی. ورودی‌های ترکیبی به تفکیک محصول آمده‌اند؛ وضعیت دسترسی و مجوز در سایت ارائه‌دهنده توضیح داده می‌شود.',
            )}
          </p>
          <div className="tools-grid">
            {tools
              .filter(
                (tool) =>
                  (normalizeSearch(
                    tool.name +
                      ' ' +
                      tool.description.en +
                      ' ' +
                      tool.description.fa,
                  ).includes(normalizeSearch(query)) ||
                    tool.courseIds.some((id) =>
                      courseMatches(courseById[id], query),
                    )) &&
                  (pathway === 'all' ||
                    tool.courseIds.some((id) =>
                      courseById[id].pathwayIds.includes(pathway),
                    )),
              )
              .map((tool) => (
                <article className="tool-card" key={tool.id}>
                  <div className="tool-card-top">
                    <span className="tool-avatar">
                      {tool.name.replace('Microsoft ', '').slice(0, 2)}
                    </span>
                    <OutLink href={tool.url}>
                      {t('Official site', 'سایت رسمی')}
                    </OutLink>
                  </div>
                  <h2 dir="ltr">{tool.name}</h2>
                  <p>{tool.description[locale]}</p>
                  <details>
                    <summary>
                      {num(tool.courseIds.length)}{' '}
                      {t('connected courses', 'درس مرتبط')}
                    </summary>
                    <div className="course-chips">
                      {tool.courseIds.map((id) => (
                        <button key={id} onClick={() => open(courseById[id])}>
                          {courseById[id].name[locale]}
                        </button>
                      ))}
                    </div>
                  </details>
                </article>
              ))}
          </div>
          {!tools.some(
            (tool) =>
              (normalizeSearch(
                tool.name +
                  ' ' +
                  tool.description.en +
                  ' ' +
                  tool.description.fa,
              ).includes(normalizeSearch(query)) ||
                tool.courseIds.some((id) =>
                  courseMatches(courseById[id], query),
                )) &&
              (pathway === 'all' ||
                tool.courseIds.some((id) =>
                  courseById[id].pathwayIds.includes(pathway),
                )),
          ) && noResults}
        </>
      )}
      {section === 'resources' && (
        <>
          <div className="explorer-toolbar">
            {searchBar}
            <FilterSelect
              label={t('Based on', 'بر اساس')}
              value={resourceBasis}
              onValueChange={(next) => update({ based: next, scope: null })}
              options={[
                ['all', 'Based on…', 'بر اساس…'],
                ['content', 'Content Categories', 'دسته‌بندی‌های محتوایی'],
                ['majors', "Master's Majors", 'گرایش‌های ارشد'],
                ['careers', 'Career Guide', 'راهنمای شغلی'],
              ].map(([id, en, fa]) => ({ value: id, label: t(en, fa) }))}
            />
            {resourceBasis !== 'all' && (
              <FilterSelect
                label={t('Related area', 'حوزه مرتبط')}
                value={resourceScope}
                onValueChange={(next) => update({ scope: next })}
                options={
                  resourceBasis === 'content'
                    ? [
                        {
                          value: 'all',
                          label: t(
                            'All content categories',
                            'همه دسته‌بندی‌های محتوایی',
                          ),
                        },
                        ...categories.map((category) => ({
                          value: category.id,
                          label: category.title[locale],
                        })),
                      ]
                    : resourceBasis === 'majors'
                      ? [
                          {
                            value: 'all',
                            label: t(
                              "All master's majors",
                              'همه گرایش‌های ارشد',
                            ),
                          },
                          ...pathways
                            .filter((pathway) => !pathway.supporting)
                            .map((pathway) => ({
                              value: pathway.id,
                              label: pathway.name[locale],
                            })),
                        ]
                      : [
                          {
                            value: 'all',
                            label: t(
                              'All career domains',
                              'همه حوزه‌های شغلی',
                            ),
                          },
                          ...careerDomains.map((domain) => ({
                            value: domain.id,
                            label: domain.name[locale],
                          })),
                        ]
                }
              />
            )}
            <FilterSelect
              label={t('Resource type', 'نوع منبع')}
              value={params.get('type') || 'all'}
              onValueChange={(next) => update({ type: next })}
              options={[
                ['all', 'All resources', 'همه منابع'],
                ['book', 'Books', 'کتاب‌ها'],
                ['blog', 'Blogs & articles', 'وبلاگ و مقاله'],
                ['official', 'Official resources', 'منابع رسمی'],
                ['learning', 'Learning guides', 'راهنمای یادگیری'],
              ].map(([id, en, fa]) => ({ value: id, label: t(en, fa) }))}
            />
            <button
              className={`filter-chip ${params.get('topic') === 'japan' ? 'selected' : ''}`}
              onClick={() =>
                update({
                  topic: params.get('topic') === 'japan' ? null : 'japan',
                })
              }
            >
              日本 / {t('Japan connection', 'ارتباط با ژاپن')}
            </button>
          </div>
          {params.get('topic') === 'japan' && (
            <div className="japan-explainer">
              <span className="japan-seal" lang="ja">
                改善
              </span>
              <div>
                <h2>
                  {t(
                    'From the classroom to the production floor',
                    'از کلاس درس تا خط تولید',
                  )}
                </h2>
                <p>
                  {t(
                    'Just-in-Time connects to inventory and production planning. Jidoka connects to quality and detecting problems at their source. Kaizen connects to work study and continuous improvement. These are educational connections to Toyota’s methods.',
                    'تولید به‌موقع با موجودی و برنامه‌ریزی تولید مرتبط است. جیدوکا با کیفیت و تشخیص مسئله در منشأ آن پیوند دارد. کایزن به کارسنجی و بهبود مستمر مرتبط است. این‌ها پیوندهای آموزشی با روش‌های تویوتا هستند.',
                  )}
                </p>
                <OutLink href="https://global.toyota/en/company/vision-and-philosophy/production-system/">
                  {t('Read Toyota’s explanation', 'توضیح تویوتا را بخوانید')}
                </OutLink>
              </div>
            </div>
          )}
          <div className="resource-list">
            {resources
              .filter(
                (r) =>
                  (!params.get('type') || r.type === params.get('type')) &&
                  (!params.get('topic') || r.japan) &&
                  matchesResourceBasis(r) &&
                  normalizeSearch(
                    r.title.en +
                      r.title.fa +
                      r.description.en +
                      r.description.fa +
                      r.author.en +
                      r.author.fa,
                  ).includes(normalizeSearch(query)),
              )
              .map((r) => (
                <article className="resource-row" key={r.id}>
                  <div className={`resource-icon ${r.type}`}>
                    <BookOpen size={26} />
                  </div>
                  <div>
                    <div className="resource-tags">
                      <span>
                        {t(
                          {
                            book: 'BOOK',
                            blog: 'BLOG',
                            official: 'OFFICIAL',
                            learning: 'LEARNING',
                          }[r.type],
                          {
                            book: 'کتاب',
                            blog: 'وبلاگ',
                            official: 'رسمی',
                            learning: 'آموزش',
                          }[r.type],
                        )}
                      </span>
                      <span
                        lang={r.language === 'en' ? 'en' : 'fa'}
                        dir={r.language === 'en' ? 'ltr' : 'rtl'}
                      >
                        {r.language === 'en' ? 'English' : 'فارسی'}
                      </span>
                      {r.japan && <span>日本</span>}
                    </div>
                    <h2>{r.title[locale]}</h2>
                    <p className="resource-author">{r.author[locale]}</p>
                    <p>{r.description[locale]}</p>
                    <ResourceConnections
                      resource={r}
                      basis={resourceBasis}
                      locale={locale}
                    />
                    {r.pdfPage && (
                      <small>
                        {t(
                          'Curriculum bibliography · page',
                          'فهرست منابع برنامه درسی · صفحه',
                        )}{' '}
                        {num(r.pdfPage)}
                      </small>
                    )}
                  </div>
                  <OutLink href={r.url}>
                    {t('Open resource', 'مشاهده منبع')}
                  </OutLink>
                </article>
              ))}
          </div>
          {!resources.some(
            (r) =>
              (!params.get('type') || r.type === params.get('type')) &&
              (!params.get('topic') || r.japan) &&
              matchesResourceBasis(r) &&
              normalizeSearch(
                r.title.en +
                  r.title.fa +
                  r.description.en +
                  r.description.fa +
                  r.author.en +
                  r.author.fa,
              ).includes(normalizeSearch(query)),
          ) && noResults}
        </>
      )}
      {section === 'wikipedia' && (
        <>
          <div className="explorer-toolbar">
            {searchBar}
            <FilterSelect
              label={t('Course type', 'نوع درس')}
              value={group}
              onValueChange={(next) => update({ group: next })}
              options={[
                {
                  value: 'all',
                  label: t('All course types', 'همه انواع دروس'),
                },
                ...officialGroups.map((g) => ({
                  value: g.id,
                  label: g.title[locale],
                })),
              ]}
            />
          </div>
          <p className="source-note">
            <Info size={15} />
            {t(
              'Links lead to related topics, not university syllabi. Article availability was checked through Wikipedia; an English article may exist without a Persian equivalent.',
              'پیوندها به موضوعات مرتبط می‌روند، نه سرفصل دانشگاهی. وجود مقاله‌ها از طریق ویکی‌پدیا بررسی شده است؛ ممکن است مقاله انگلیسی معادل فارسی نداشته باشد.',
            )}
          </p>
          <div className="results-meta" aria-live="polite">
            {num(
              matching.filter((c) => group === 'all' || c.group === group)
                .length,
            )}{' '}
            {t('courses', 'درس')}
          </div>
          <div className="wiki-list">
            {matching
              .filter((c) => group === 'all' || c.group === group)
              .map((c) => (
                <article key={c.id} className="wiki-row">
                  <button onClick={() => open(c)}>
                    <span className="course-code" dir="ltr">
                      {c.code || '—'}
                    </span>
                    <strong>{c.name[locale]}</strong>
                    <small>{t('Related concepts', 'مفاهیم مرتبط')}</small>
                  </button>
                  <div className="wiki-destinations">
                    {(['en', 'fa'] as const).map((lang) => (
                      <div key={lang}>
                        <span className="language-label">
                          {lang === 'en' ? 'EN' : 'فا'}
                        </span>
                        {c.wikipedia[lang] ? (
                          <OutLink lang={lang} href={c.wikipedia[lang]!.url}>
                            {c.wikipedia[lang]!.title}
                          </OutLink>
                        ) : (
                          <span className="unavailable">
                            {t(
                              'No verified article',
                              'مقاله تأییدشده موجود نیست',
                            )}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
          </div>
          {matching.filter((c) => group === 'all' || c.group === group)
            .length === 0 && noResults}
        </>
      )}
      {section !== 'careers' && (
        <CourseDialog
          course={selected}
          locale={locale}
          category={section === 'chart' ? selectedCat?.id : undefined}
          alternateUrl={`/${locale === 'en' ? 'fa' : 'en'}/${section}${searchString}`}
          useArtwork={section === 'chart'}
          returnFocus={returnFocus}
          onClose={() => update({ course: null })}
          onCourse={open}
        />
      )}
    </>
  );
}
function CourseDialog({
  course,
  locale,
  category,
  alternateUrl,
  useArtwork,
  returnFocus,
  onClose,
  onCourse,
}: {
  course?: Course;
  locale: Locale;
  category?: string;
  alternateUrl: string;
  useArtwork: boolean;
  returnFocus: HTMLElement | null;
  onClose: () => void;
  onCourse: (course: Course) => void;
}) {
  const t = (en: string, fa: string) => (locale === 'fa' ? fa : en);
  const num = (n: number) => formatNumber(n, locale);
  const cat = useArtwork
    ? categories.find((c) => c.id === (category || course?.categories[0]))
    : undefined;
  return (
    <Dialog
      open={!!course}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent
        lang={locale}
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
        finalFocus={() => returnFocus}
        className="course-dialog"
        showCloseButton={false}
      >
        {course && (
          <>
            <div
              className="dialog-banner"
              style={
                {
                  '--image-position': cat?.position,
                  '--mobile-position': cat?.mobilePosition,
                  '--category-color': cat?.color,
                } as CSSProperties
              }
            >
              {cat?.asset && (
                <img
                  alt=""
                  src={withBasePath(cat.asset)}
                  className="category-art"
                />
              )}
              <div className="card-shade" />
              <Link
                className="dialog-language"
                href={alternateUrl}
                lang={locale === 'en' ? 'fa' : 'en'}
              >
                {t('فارسی', 'English')}
              </Link>
              <DialogClose
                className="dialog-close"
                aria-label={t('Close course details', 'بستن جزئیات درس')}
              >
                <X size={21} />
              </DialogClose>
              <span className="character">
                {t('COURSE PROFILE', 'معرفی درس')}
              </span>
              <div className="dialog-meta">
                <span dir="ltr">
                  {course.code ||
                    t('Supplementary / General', 'تکمیلی / عمومی')}
                </span>
                <span>
                  {num(course.credits)} {t('credits', 'واحد')}
                </span>
              </div>
              <DialogTitle className="dialog-title">
                {course.name[locale]}
              </DialogTitle>
              <p
                lang={locale === 'en' ? 'fa' : 'en'}
                dir={locale === 'en' ? 'rtl' : 'ltr'}
              >
                {course.name[locale === 'en' ? 'fa' : 'en']}
              </p>
            </div>
            <div className="dialog-body">
              <span className="type-badge">
                {officialGroups.find((g) => g.id === course.group)?.title[
                  locale
                ] || t('Supplementary pathway course', 'درس تکمیلی مسیر')}
              </span>
              <DialogDescription className="course-description">
                {course.description[locale]}
              </DialogDescription>
              <section>
                <h3>{t('Before this course', 'پیش از این درس')}</h3>
                {course.prerequisiteIds.length > 0 ? (
                  <div className="course-chips">
                    {course.prerequisiteIds.map((id) => (
                      <button key={id} onClick={() => onCourse(courseById[id])}>
                        {courseById[id].name[locale]}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="muted">
                    {t(
                      'No course prerequisite listed in the available source.',
                      'در منبع موجود، پیش‌نیاز درسی ثبت نشده است.',
                    )}
                  </p>
                )}
                {course.corequisiteIds.length > 0 && (
                  <>
                    <p className="detail-label">
                      {t('May be taken concurrently', 'امکان اخذ هم‌زمان')}
                    </p>
                    <div className="course-chips">
                      {course.corequisiteIds.map((id) => (
                        <button
                          key={id}
                          onClick={() => onCourse(courseById[id])}
                        >
                          {courseById[id].name[locale]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {course.standing && (
                  <p className="standing-note">
                    {locale === 'fa'
                      ? course.standing.fa.replace(
                          /\d/g,
                          (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)],
                        )
                      : course.standing.en}
                  </p>
                )}
              </section>
              <section>
                <h3>{t('Connected pathways', 'مسیرهای مرتبط')}</h3>
                <div className="course-chips">
                  {course.pathwayIds.map((id) => (
                    <Link
                      key={id}
                      href={`/${locale}/chart?view=pathways&pathway=${id}`}
                    >
                      {pathways.find((p) => p.id === id)!.name[locale]}
                      <ArrowUpRight size={13} />
                    </Link>
                  ))}
                </div>
                {!course.pathwayIds.length && (
                  <p className="muted">
                    {t(
                      'No specialization mapping supplied for this course.',
                      'برای این درس، نگاشت گرایش ارائه نشده است.',
                    )}
                  </p>
                )}
              </section>
              <section>
                <h3>{t('Tools for the work', 'ابزارهای مرتبط')}</h3>
                <div className="course-chips">
                  {tools
                    .filter((tool) => tool.courseIds.includes(course.id))
                    .map((tool) => (
                      <OutLink key={tool.id} href={tool.url}>
                        {tool.name}
                      </OutLink>
                    ))}
                </div>
                {!tools.some((tool) => tool.courseIds.includes(course.id)) && (
                  <p className="muted">
                    {t(
                      'No specific software mapped in the workbook.',
                      'در کاربرگ، نرم‌افزار مشخصی به این درس مرتبط نشده است.',
                    )}
                  </p>
                )}
              </section>
              <section>
                <h3>{t('Resources', 'منابع')}</h3>
                {resourcesForCourse(course.id).length > 0 ? (
                  <div className="dialog-resource-list">
                    {resourcesForCourse(course.id).map((resource) => (
                      <OutLink key={resource.id} href={resource.url}>
                        {resource.title[locale]}
                      </OutLink>
                    ))}
                  </div>
                ) : (
                  <Link
                    className="dialog-resource-browse"
                    href={`/${locale}/resources?based=content`}
                  >
                    {t('Browse related resources', 'مشاهده منابع مرتبط')}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                )}
              </section>
              {course.categories.includes('core') && (
                <section className="course-japan">
                  <span className="detail-label">
                    日本 / {t('An industry connection', 'ارتباط با صنعت')}
                  </span>
                  <p>
                    {t(
                      'Compare the course’s ideas with Toyota’s approach to production flow, quality and continuous improvement.',
                      'ایده‌های این درس را با رویکرد تویوتا به جریان تولید، کیفیت و بهبود مستمر مقایسه کنید.',
                    )}
                  </p>
                  <OutLink href="https://global.toyota/en/company/vision-and-philosophy/production-system/">
                    {t('Toyota Production System', 'سیستم تولید تویوتا')}
                  </OutLink>
                </section>
              )}
              <section>
                <h3>{t('Explore on Wikipedia', 'کاوش در ویکی‌پدیا')}</h3>
                <p className="detail-label">
                  {t(
                    'Related topics · external articles',
                    'موضوعات مرتبط · مقاله‌های خارجی',
                  )}
                </p>
                <div className="wiki-dialog-links">
                  {(['en', 'fa'] as const).map((lang) =>
                    course.wikipedia[lang] ? (
                      <OutLink
                        key={lang}
                        lang={lang}
                        href={course.wikipedia[lang]!.url}
                      >
                        {course.wikipedia[lang]!.title}
                      </OutLink>
                    ) : (
                      <span key={lang} className="unavailable">
                        {lang === 'en' ? 'EN' : 'فا'} —{' '}
                        {t('No verified article', 'مقاله تأییدشده موجود نیست')}
                      </span>
                    ),
                  )}
                </div>
              </section>
              <details className="sources-details">
                <summary>
                  {t(
                    'Sources & curriculum notes',
                    'منابع و یادداشت‌های برنامه درسی',
                  )}
                </summary>
                <ul>
                  {course.sources.map((s, i) => (
                    <li key={i}>
                      {s.file === 'curriculum' ? (
                        <OutLink href={`/curriculum-1403.pdf#page=${s.page}`}>
                          {t(
                            '1403 curriculum · page',
                            'برنامه درسی ۱۴۰۳ · صفحه',
                          )}{' '}
                          {num(s.page!)}
                        </OutLink>
                      ) : (
                        <span>
                          ISE Chart Analysis ·{' '}
                          <bdi>
                            {s.sheet} · {s.range}
                          </bdi>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <p>
                  {t(
                    'Excel controls the course catalog and classification. PDF details enrich the record; university rules should be checked for registration.',
                    'فهرست و دسته‌بندی بر پایه اکسل است. جزئیات PDF اطلاعات درس را تکمیل می‌کند؛ برای ثبت‌نام، مقررات دانشگاه را بررسی کنید.',
                  )}
                </p>
              </details>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
