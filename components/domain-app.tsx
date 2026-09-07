'use client';
/* Supplied SVG artwork is preserved intact and loaded lazily; raster optimization does not apply. */
/* eslint-disable @next/next/no-img-element */
import { Suspense, useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  Globe2,
  Sun,
  Moon,
  Menu,
  X,
  ScanLine,
  GraduationCap,
  Wrench,
  BookOpen,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { categories, type Locale } from '@/lib/domain-config';
import { Explorer } from '@/components/explorer';
const navigation = [
  ['home', 'Overview', 'نمای کلی'],
  ['chart', 'Chart Analysis', 'تحلیل چارت'],
  ['majors', 'Master’s Majors', 'گرایش‌های ارشد'],
  ['tools', 'Tools & Software', 'ابزار و نرم‌افزار'],
  ['resources', 'Resources', 'منابع'],
  ['wikipedia', 'Wikipedia', 'ویکی‌پدیا'],
];
const subscribeTheme = (listener: () => void) => {
  window.addEventListener('ise-themechange', listener);
  return () => window.removeEventListener('ise-themechange', listener);
};
const readTheme = () => document.documentElement.dataset.theme || 'dark';
export function DomainApp({
  locale,
  section,
}: {
  locale: Locale;
  section: string;
}) {
  const fa = locale === 'fa';
  const t = (en: string, per: string) => (fa ? per : en);
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'dark');
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = fa ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('ise-language', locale);
    } catch {}
  }, [locale, fa]);
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    window.dispatchEvent(new Event('ise-themechange'));
    try {
      localStorage.setItem('ise-theme', next);
    } catch {}
  }
  const href = (id: string) => `/${locale}${id === 'home' ? '' : `/${id}`}`;
  return (
    <div className="site-shell" dir={fa ? 'rtl' : 'ltr'}>
      <a href="#main" className="skip-link">
        {t('Skip to content', 'رفتن به محتوا')}
      </a>
      <header className="site-header">
        <Link href={href('home')} className="brand">
          <span className="brand-symbol">
            <ScanLine size={25} />
          </span>
          <span>
            ISE<span className="brand-thin">DOMAIN</span>
            <small>INDUSTRIAL & SYSTEMS ENGINEERING</small>
          </span>
        </Link>
        <nav
          aria-label={t('Main navigation', 'ناوبری اصلی')}
          className={menu ? 'main-nav open' : 'main-nav'}
        >
          {navigation.map(([id, en, per]) => (
            <Link
              onClick={() => setMenu(false)}
              aria-current={section === id ? 'page' : undefined}
              className={section === id ? 'active' : ''}
              key={id}
              href={href(id)}
            >
              {t(en, per)}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="language-button"
            href={`/${fa ? 'en' : 'fa'}${section === 'home' ? '' : `/${section}`}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/${fa ? 'en' : 'fa'}${section === 'home' ? '' : `/${section}`}${window.location.search}`;
            }}
            lang={fa ? 'en' : 'fa'}
          >
            <Globe2 size={16} />
            {fa ? 'EN' : 'فا'}
          </a>
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={t('Switch color theme', 'تغییر حالت رنگ')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="icon-button menu-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label={t('Toggle navigation', 'باز کردن فهرست')}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main" className="main-content">
        {section === 'home' ? (
          <>
            <div className="eyebrow">
              <span className="live-dot" />
              {t('A NEW PERSPECTIVE ON ENGINEERING', 'نگاهی تازه به مهندسی')}
              <span className="eyebrow-end">
                EST. 1403 <span>↗</span>
              </span>
            </div>
            <section className="intro">
              <div>
                <p className="overline">
                  {t('WELCOME TO YOUR DOMAIN', 'به قلمرو خودتان خوش آمدید')}
                </p>
                <h1>
                  {t('EVERY SYSTEM.', 'هر سیستم.')}
                  <br />
                  <span>{t('INFINITE POSSIBILITIES.', 'بی‌نهایت امکان.')}</span>
                </h1>
                <p className="intro-copy">
                  {t(
                    'People. Data. Decisions. Discover the engineering that connects them all — and find where you belong.',
                    'انسان‌ها، داده‌ها و تصمیم‌ها. مهندسی‌ای را کشف کنید که همه را به هم پیوند می‌دهد؛ و مسیر خودتان را پیدا کنید.',
                  )}
                </p>
                <Link className="primary-button" href={href('chart')}>
                  {t('Explore the curriculum', 'کاوش در برنامه درسی')}
                  <ArrowUpRight size={18} />
                </Link>
              </div>
              <aside className="intro-aside">
                <span className="vertical-japanese" lang="ja">
                  無限の可能性
                </span>
                <div className="domain-mark">
                  領域<span>DOMAIN / 01</span>
                </div>
                <p>
                  {t('See the whole picture.', 'تصویر کامل را ببینید.')}
                  <br />
                  {t('Change how it works.', 'کارکرد آن را تغییر دهید.')}
                </p>
                <div className="tiny-rule" />
                <span className="small-label">
                  {t('ENGINEER YOUR OWN PATH', 'مسیر خود را مهندسی کنید')}
                </span>
              </aside>
            </section>
            <div className="stats-strip">
              <div>
                <strong>140</strong>
                <span>{t('Degree credits', 'واحد دوره')}</span>
              </div>
              <div>
                <strong>06</strong>
                <span>{t('Fields of knowledge', 'حوزه دانش')}</span>
              </div>
              <div>
                <strong>07</strong>
                <span>{t('Graduate pathways', 'مسیر تحصیلات تکمیلی')}</span>
              </div>
              <p>
                <Sparkles size={18} />
                {t(
                  'One discipline. A world of directions.',
                  'یک رشته؛ دنیایی از مسیرها.',
                )}
              </p>
            </div>
            <section>
              <div className="section-heading">
                <div>
                  <p className="overline">
                    01 / {t('CHOOSE YOUR FIELD', 'حوزه خود را انتخاب کنید')}
                  </p>
                  <h2>
                    {t('EXPLORE THE DOMAINS', 'قلمروها را کشف کنید')}
                    <span className="heading-dot">.</span>
                  </h2>
                </div>
                <Link className="text-link" href={href('chart')}>
                  {t('View full chart', 'مشاهده چارت کامل')}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="domain-grid">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`${href('chart')}?view=content&category=${c.id}`}
                    className={`domain-card category-${c.id}`}
                    style={
                      {
                        '--category-color': c.color,
                        '--image-position': c.position,
                        '--mobile-position': c.mobilePosition,
                      } as React.CSSProperties
                    }
                  >
                    {c.asset && (
                      <img
                        loading="lazy"
                        src={c.asset}
                        alt=""
                        className="category-art"
                      />
                    )}
                    <div className="card-shade" />
                    <div className="card-top">
                      <span>領域 {c.number}</span>
                      <ArrowUpRight size={20} />
                    </div>
                    <div className="card-bottom">
                      <span className="character">{c.character[locale]}</span>
                      <h3>{c.title[locale]}</h3>
                      <p>{c.caption[locale]}</p>
                      <span className="card-explore">
                        {t('Explore courses', 'مشاهده دروس')}
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            <section className="module-section">
              <div className="section-heading">
                <div>
                  <p className="overline">
                    02 / {t('GO BEYOND THE CHART', 'فراتر از چارت')}
                  </p>
                  <h2>
                    {t('YOUR NEXT CHAPTER', 'فصل بعدی شما')}
                    <span className="heading-dot">.</span>
                  </h2>
                </div>
              </div>
              <div className="module-grid">
                {[
                  {
                    Icon: GraduationCap,
                    id: 'majors',
                    en: 'Find your specialization',
                    fa: 'گرایش خود را پیدا کنید',
                    desc: 'From optimization to financial systems.',
                    per: 'از بهینه‌سازی تا سیستم‌های مالی.',
                  },
                  {
                    Icon: Wrench,
                    id: 'tools',
                    en: 'Build your toolkit',
                    fa: 'جعبه‌ابزار خود را بسازید',
                    desc: 'Meet the software behind the solutions.',
                    per: 'با نرم‌افزارهای پشت راه‌حل‌ها آشنا شوید.',
                  },
                  {
                    Icon: BookOpen,
                    id: 'resources',
                    en: 'Keep your curiosity alive',
                    fa: 'کنجکاوی را زنده نگه دارید',
                    desc: 'Books, ideas and trusted places to learn.',
                    per: 'کتاب‌ها، ایده‌ها و منابع معتبر یادگیری.',
                  },
                  {
                    Icon: ExternalLink,
                    id: 'wikipedia',
                    en: 'Follow the knowledge',
                    fa: 'دانش را دنبال کنید',
                    desc: 'Explore the concepts behind each course.',
                    per: 'مفاهیم هر درس را عمیق‌تر بشناسید.',
                  },
                ].map(({ Icon, id, en, fa: per, desc, per: pdesc }) => (
                  <Link className="module-card" href={href(id)} key={id}>
                    <Icon size={24} />
                    <h3>{t(en, per)}</h3>
                    <p>{t(desc, pdesc)}</p>
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              </div>
            </section>
            <section className="japan-note">
              <div className="japan-seal" lang="ja">
                改善
              </div>
              <div>
                <p className="overline">
                  {t(
                    'FROM JAPAN, TO THE WAY YOU THINK',
                    'از ژاپن تا شیوه اندیشیدن شما',
                  )}
                </p>
                <h2>
                  {t(
                    'Small improvements. Real impact.',
                    'بهبودهای کوچک؛ تأثیر واقعی.',
                  )}
                </h2>
                <p>
                  {t(
                    'Kaizen connects everyday observation to better systems. Explore how Japanese industry turns ideas from your courses into practice.',
                    'کایزن مشاهده روزمره را به سیستم‌های بهتر پیوند می‌دهد. ببینید صنعت ژاپن چگونه ایده‌های درسی شما را عملی می‌کند.',
                  )}
                </p>
              </div>
              <Link
                className="text-link"
                href={`${href('resources')}?topic=japan`}
              >
                {t('Explore the connection', 'کشف این ارتباط')}
                <ArrowUpRight size={17} />
              </Link>
            </section>
          </>
        ) : (
          <Suspense
            fallback={
              <p className="loading-state">
                {t('Loading the catalog…', 'در حال بارگذاری فهرست…')}
              </p>
            }
          >
            <Explorer locale={locale} section={section} />
          </Suspense>
        )}
      </main>
      <footer>
        <Link className="footer-brand" href={href('home')}>
          ISE DOMAIN<span>領域</span>
        </Link>
        <p>
          {t(
            'A personal exploration of engineering, anime & Japanese industry.',
            'کاوشی شخصی در مهندسی، انیمه و صنعت ژاپن.',
          )}
        </p>
        <span>{t('Built for curious minds.', 'برای ذهن‌های کنجکاو.')}</span>
      </footer>
    </div>
  );
}
