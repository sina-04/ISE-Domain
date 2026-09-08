'use client';
/* Supplied SVG artwork is preserved intact and loaded lazily; raster optimization does not apply. */
/* eslint-disable @next/next/no-img-element */
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from 'react';
import { flushSync } from 'react-dom';
import Link from '@/components/site-link';
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
  Star,
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
function GitHubMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
    >
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.16 1.18a10.99 10.99 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}
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
  const [stars, setStars] = useState<number | null>(null);
  const themeTransition = useRef(false);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = fa ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('ise-language', locale);
    } catch {}
  }, [locale, fa]);
  useEffect(() => {
    let active = true;
    const loadStars = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/sina-04/ISE-Domain',
          { headers: { Accept: 'application/vnd.github+json' } },
        );
        if (!response.ok) return;
        const data = (await response.json()) as { stargazers_count?: number };
        if (active && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
        }
      } catch {
        // Keep the GitHub destination usable when the public API is unavailable.
      }
    };
    void loadStars();
    const refresh = window.setInterval(loadStars, 15 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, []);
  async function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    if (themeTransition.current) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    const applyTheme = () => {
      document.documentElement.dataset.theme = next;
      window.dispatchEvent(new Event('ise-themechange'));
      try {
        localStorage.setItem('ise-theme', next);
      } catch {}
    };
    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      applyTheme();
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    document.documentElement.style.setProperty('--theme-x', `${x}px`);
    document.documentElement.style.setProperty('--theme-y', `${y}px`);
    document.documentElement.style.setProperty('--theme-radius', `${radius}px`);
    themeTransition.current = true;
    try {
      const transition = document.startViewTransition(() =>
        flushSync(applyTheme),
      );
      await transition.ready;
      await transition.finished;
    } catch {
      applyTheme();
    } finally {
      themeTransition.current = false;
    }
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
          <div className="github-actions">
            <a
              className="github-link github-profile"
              href="https://github.com/sina-04"
              target="_blank"
              rel="noreferrer"
              aria-label={t(
                "Open Sina's GitHub profile",
                'نمایش پروفایل گیت‌هاب سینا',
              )}
            >
              <GitHubMark size={18} />
              <span className="github-handle">sina-04</span>
            </a>
            <a
              className="github-link github-stars"
              href="https://github.com/sina-04/ISE-Domain"
              target="_blank"
              rel="noreferrer"
              aria-label={t(
                stars === null
                  ? 'Open ISE Domain on GitHub; star count is loading'
                  : `Open ISE Domain on GitHub; ${stars} stars`,
                stars === null
                  ? 'نمایش پروژه در گیت‌هاب؛ شمارش ستاره‌ها در حال بارگذاری است'
                  : `نمایش پروژه در گیت‌هاب؛ ${stars.toLocaleString('fa-IR')} ستاره`,
              )}
            >
              <Star size={16} aria-hidden="true" />
              <span className="star-count" aria-hidden="true">
                {stars === null
                  ? '…'
                  : stars.toLocaleString(fa ? 'fa-IR' : 'en-US')}
              </span>
            </a>
          </div>
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
                {t('EST. 1403', 'از ۱۴۰۳')} <span>↗</span>
              </span>
            </div>
            <section className="intro">
              <div>
                <p className="overline">
                  {t('WELCOME TO YOUR DOMAIN', 'به قلمرو خودتان خوش آمدید')}
                </p>
                <h1>
                  {t('EVERY SYSTEM.', 'دنیای سیستم‌ها،')}
                  <br />
                  <span>{t('INFINITE POSSIBILITIES.', 'قلمرو فرصت‌ها.')}</span>
                </h1>
                <p className="intro-copy">
                  {t(
                    'People. Data. Decisions. Discover the engineering that connects them all — and find where you belong.',
                    'مهندسی صنایع و سیستم‌ها، انسان‌ها، داده‌ها و فرایندها را به هم پیوند می‌دهد تا تصمیم‌های بهتری بگیریم. از شناخت درس‌ها شروع کنید و مسیر خودتان را بسازید.',
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
                  領域<span>{t('DOMAIN / 01', 'قلمرو / ۰۱')}</span>
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
                <strong>{t('140', '۱۴۰')}</strong>
                <span>{t('Degree credits', 'واحد دوره')}</span>
              </div>
              <div>
                <strong>{t('06', '۰۶')}</strong>
                <span>{t('Fields of knowledge', 'حوزه دانش')}</span>
              </div>
              <div>
                <strong>{t('07', '۰۷')}</strong>
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
                    {t('01', '۰۱')} /{' '}
                    {t('CHOOSE YOUR FIELD', 'حوزه خود را انتخاب کنید')}
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
                      <span>
                        領域{' '}
                        {fa
                          ? c.number.replace(
                              /\d/g,
                              (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)],
                            )
                          : c.number}
                      </span>
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
                    {t('02', '۰۲')} /{' '}
                    {t('GO BEYOND THE CHART', 'فراتر از چارت')}
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
