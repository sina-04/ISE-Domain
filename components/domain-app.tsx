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
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Wrench,
  BookOpen,
  ExternalLink,
  Star,
  Sparkles,
  ArrowUp,
  BriefcaseBusiness,
  Mail,
} from 'lucide-react';
import { categories, type Locale } from '@/lib/domain-config';
import { Explorer } from '@/components/explorer';
import { DataSciencePage } from '@/components/data-science-page';
import { SiteSearch } from '@/components/site-search';
import { withBasePath } from '@/lib/base-path';
const navigation = [
  ['home', 'Overview', 'نمای کلی'],
  ['chart', 'Chart Analysis', 'تحلیل چارت'],
  ['majors', 'Master’s Majors', 'گرایش‌های ارشد'],
  ['careers', 'Career Guide', 'راهنمای شغلی'],
  ['tools', 'Tools & Software', 'ابزار و نرم‌افزار'],
  ['resources', 'Resources', 'منابع'],
  ['wikipedia', 'Wikipedia', 'ویکی‌پدیا'],
];
const japaneseIndustryCards = [
  {
    seal: '改善',
    overline: {
      en: 'KAIZEN / CONTINUOUS IMPROVEMENT',
      fa: 'کایزن / بهبود مستمر',
    },
    title: {
      en: 'Small improvements. Real impact.',
      fa: 'بهبودهای کوچک؛ تأثیر واقعی.',
    },
    copy: {
      en: 'Kaizen connects everyday observation to better systems and turns ideas from your courses into practical improvements.',
      fa: 'کایزن مشاهده روزمره را به سیستم‌های بهتر پیوند می‌دهد و ایده‌های درسی را به بهبودهای عملی تبدیل می‌کند.',
    },
  },
  {
    seal: '適時',
    overline: {
      en: 'JUST-IN-TIME / FLOW',
      fa: 'تولید به‌موقع / جریان',
    },
    title: {
      en: 'The right work, at the right moment.',
      fa: 'کار درست، درست در زمان نیاز.',
    },
    copy: {
      en: 'Just-in-Time connects inventory, production planning and demand so material moves with less delay and waste.',
      fa: 'تولید به‌موقع، موجودی، برنامه‌ریزی تولید و تقاضا را به هم پیوند می‌دهد تا مواد با تأخیر و اتلاف کمتر جریان پیدا کنند.',
    },
  },
  {
    seal: '自働化',
    overline: {
      en: 'JIDOKA / QUALITY AT THE SOURCE',
      fa: 'جیدوکا / کیفیت در منشأ',
    },
    title: {
      en: 'Make problems visible early.',
      fa: 'مسئله را زودتر آشکار کنید.',
    },
    copy: {
      en: 'Jidoka combines human judgment with automation: stop when something is wrong, learn from it, and protect quality.',
      fa: 'جیدوکا قضاوت انسانی را با خودکارسازی ترکیب می‌کند: هنگام خطا توقف کنید، از آن بیاموزید و از کیفیت محافظت کنید.',
    },
  },
] as const;
const SUKUNA_PLAYED_KEY = 'ise-sukuna-domain-played';
type SukunaPhase = 'wallpaper' | 'fire' | 'reveal' | null;
const SUKUNA_EMBERS = Array.from({ length: 56 }, (_, index) => ({
  x: `${(index * 37 + 11) % 101}%`,
  base: `${2 + ((index * 17) % 35)}%`,
  size: `${2 + (index % 4)}px`,
  delay: `${-((index % 14) * 0.29)}s`,
  duration: `${2.4 + (index % 7) * 0.34}s`,
  drift: `${(index % 2 === 0 ? 1 : -1) * (18 + (index % 5) * 11)}px`,
  rise: `${42 + (index % 6) * 9}vh`,
  color: ['#ff2f12', '#ff6a16', '#ff9d18', '#ffd34d'][index % 4],
}));
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
function LinkedInMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6.5 8.3H3.2V21h3.3V8.3ZM4.85 3A1.95 1.95 0 1 0 4.85 6.9 1.95 1.95 0 0 0 4.85 3ZM20.8 13.7c0-3.83-2.04-5.61-4.77-5.61-2.2 0-3.18 1.21-3.72 2.06V8.3H9.02V21h3.29v-6.29c0-1.66.31-3.27 2.37-3.27 2.03 0 2.06 1.9 2.06 3.38V21H20.8v-7.3Z" />
    </svg>
  );
}
function XMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.51 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}
function TelegramMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M21.75 2.44 2.95 9.69c-1.28.51-1.27 1.22-.23 1.54l4.82 1.5 1.85 5.66c.23.64.11.9.78.9.52 0 .75-.24 1.04-.52l2.31-2.24 4.8 3.55c.88.49 1.52.24 1.74-.82l3.15-14.86c.32-1.29-.49-1.88-1.46-1.46ZM8.3 12.39 19.17 5.5c.54-.33 1.03-.15.63.2l-8.97 8.13-.35 3.75-2.18-5.19Z" />
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
  const [activeSection, setActiveSection] = useState(section);
  const [menu, setMenu] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  const [audioPending, setAudioPending] = useState<string | null>(null);
  const [sukunaPhase, setSukunaPhase] = useState<SukunaPhase>(null);
  const [japanCard, setJapanCard] = useState(0);
  const themeTransition = useRef(false);
  const sukunaPlayed = useRef(false);
  const activeDomainAudio = useRef<HTMLAudioElement | null>(null);
  const transitionTimers = useRef<number[]>([]);
  const sukunaActive = sukunaPhase !== null;
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = fa ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('ise-language', locale);
    } catch {}
  }, [locale, fa]);
  useEffect(() => {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (navigationEntry?.type === 'reload') {
        sessionStorage.removeItem(SUKUNA_PLAYED_KEY);
      }
      sukunaPlayed.current =
        sessionStorage.getItem(SUKUNA_PLAYED_KEY) === 'true';
    } catch {
      sukunaPlayed.current = false;
    }
  }, []);
  useEffect(() => {
    if (activeSection !== 'home') return;
    const timer = window.setInterval(
      () =>
        setJapanCard((current) => (current + 1) % japaneseIndustryCards.length),
      10_000,
    );
    return () => window.clearInterval(timer);
  }, [activeSection, japanCard]);
  useEffect(() => {
    if (!sukunaActive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sukunaActive]);
  useEffect(() => {
    const syncSectionFromLocation = () => {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const localeIndex = parts.lastIndexOf(locale);
      setActiveSection(parts[localeIndex + 1] || 'home');
    };
    window.addEventListener('popstate', syncSectionFromLocation);
    return () =>
      window.removeEventListener('popstate', syncSectionFromLocation);
  }, [locale]);
  useEffect(
    () => () => {
      for (const timer of transitionTimers.current) {
        window.clearTimeout(timer);
      }
      activeDomainAudio.current?.pause();
      activeDomainAudio.current = null;
    },
    [],
  );
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
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const revealSelector = [
      '.eyebrow',
      '.intro',
      '.stats-strip',
      '.section-heading',
      '.domain-card',
      '.module-card',
      '.japan-note',
      '.page-heading',
      '.explorer-toolbar',
      '.source-note',
      '.degree-summary',
      '.course-group',
      '.pathway-card',
      '.career-map',
      '.career-domain-section',
      '.career-card',
      '.supporting-grid',
      '.tool-card',
      '.japan-explainer',
      '.resource-row',
      '.wiki-row',
      'footer',
    ].join(',');
    const tracked = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    );
    const register = () => {
      document.querySelectorAll(revealSelector).forEach((element) => {
        if (tracked.has(element)) return;
        tracked.add(element);
        element.classList.add('scroll-reveal');
        observer.observe(element);
      });
    };

    register();
    const main = document.getElementById('main');
    const mutations = new MutationObserver(register);
    if (main) mutations.observe(main, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [activeSection]);
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
  function stopDomainAudio() {
    if (activeDomainAudio.current) {
      activeDomainAudio.current.pause();
      activeDomainAudio.current.currentTime = 0;
      activeDomainAudio.current = null;
    }
    setAudioPending(null);
  }
  function showDomain(categoryId: string) {
    const destination = withBasePath(
      `${href('chart')}?view=content&category=${categoryId}`,
    );
    window.history.pushState(window.history.state, '', destination);
    window.dispatchEvent(new Event('ise-querychange'));
    setActiveSection('chart');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  function handleDomainClick(
    event: MouseEvent<HTMLAnchorElement>,
    category: (typeof categories)[number],
  ) {
    if (!category.audio) return;

    event.preventDefault();
    stopDomainAudio();
    const audio = new Audio(withBasePath(category.audio));
    audio.preload = 'auto';
    activeDomainAudio.current = audio;
    setAudioPending(category.id);
    const finishAudio = () => {
      if (activeDomainAudio.current !== audio) return;
      activeDomainAudio.current = null;
      setAudioPending(null);
    };
    audio.addEventListener('ended', finishAudio, { once: true });
    audio.addEventListener('error', finishAudio, { once: true });

    if (category.id === 'math' && !sukunaPlayed.current) {
      sukunaPlayed.current = true;
      try {
        sessionStorage.setItem(SUKUNA_PLAYED_KEY, 'true');
      } catch {}

      flushSync(() => setSukunaPhase('wallpaper'));
      void audio.play().catch(finishAudio);
      const fireTimer = window.setTimeout(() => setSukunaPhase('fire'), 7000);
      const revealTimer = window.setTimeout(() => {
        showDomain(category.id);
        setSukunaPhase('reveal');
      }, 18000);
      const clearTimer = window.setTimeout(() => setSukunaPhase(null), 23000);
      transitionTimers.current = [fireTimer, revealTimer, clearTimer];
      return;
    }

    const playback = audio.play();
    showDomain(category.id);
    void playback.catch(finishAudio);
  }
  return (
    <div id="top" className="site-shell" dir={fa ? 'rtl' : 'ltr'}>
      <a href="#main" className="skip-link">
        {t('Skip to content', 'رفتن به محتوا')}
      </a>
      <header className="site-header">
        <Link href={href('home')} className="brand">
          <span className="brand-symbol" aria-hidden="true">
            🏭
          </span>
          <span>
            ISE<span className="brand-thin">DOMAIN</span>
            <small>INDUSTRIAL & SYSTEMS ENGINEERING</small>
          </span>
        </Link>
        <SiteSearch locale={locale} />
        <nav
          aria-label={t('Main navigation', 'ناوبری اصلی')}
          className={menu ? 'main-nav open' : 'main-nav'}
        >
          {navigation.map(([id, en, per]) => (
            <Link
              onClick={() => setMenu(false)}
              aria-current={activeSection === id ? 'page' : undefined}
              className={activeSection === id ? 'active' : ''}
              key={id}
              href={href(id)}
            >
              {t(en, per)}
            </Link>
          ))}
          <div className="mobile-github-actions">
            <a
              href="https://github.com/sina-04"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenu(false)}
            >
              <GitHubMark size={18} />
              {t('GitHub profile', 'پروفایل گیت‌هاب')}
            </a>
            <a
              href="https://github.com/sina-04/ISE-Domain"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenu(false)}
            >
              <Star size={17} aria-hidden="true" />
              {t('Project repository', 'مخزن پروژه')}
              {stars !== null && (
                <span className="mobile-star-count" aria-hidden="true">
                  {stars.toLocaleString(fa ? 'fa-IR' : 'en-US')}
                </span>
              )}
            </a>
          </div>
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
            href={withBasePath(
              `/${fa ? 'en' : 'fa'}${activeSection === 'home' ? '' : `/${activeSection}`}`,
            )}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = withBasePath(
                `/${fa ? 'en' : 'fa'}${activeSection === 'home' ? '' : `/${activeSection}`}${window.location.search}`,
              );
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
        {activeSection === 'home' ? (
          <>
            <div className="eyebrow">
              <span className="live-dot" />
              {t('A NEW PERSPECTIVE ON ENGINEERING', 'نگاهی تازه به مهندسی')}
              <span className="eyebrow-end">
                {t('EST. 1403', 'از ۱۴۰۳')} <span>↗</span>
              </span>
            </div>
            <section className="intro">
              <div className="intro-main">
                <img
                  aria-hidden="true"
                  alt=""
                  className="intro-art"
                  src={withBasePath('/JJK-all-in-one.svg')}
                />
                <div className="intro-main-content">
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
                <strong>{t('07', '۰۷')}</strong>
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
                    onClick={(event) => handleDomainClick(event, c)}
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
                        src={withBasePath(c.asset)}
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
                    Icon: BriefcaseBusiness,
                    id: 'careers',
                    en: 'Explore career paths',
                    fa: 'مسیرهای شغلی را کشف کنید',
                    desc: 'From data and projects to operations and business.',
                    per: 'از داده و پروژه تا عملیات و کسب‌وکار.',
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
            <section
              className="japan-note japan-carousel"
              aria-roledescription={t('carousel', 'اسلایدشو')}
              aria-label={t('Japanese industry principles', 'اصول صنعت ژاپن')}
            >
              <div className="japan-seal" lang="ja" key={`seal-${japanCard}`}>
                {japaneseIndustryCards[japanCard].seal}
              </div>
              <div className="japan-slide" key={japanCard}>
                <p className="overline">
                  {japaneseIndustryCards[japanCard].overline[locale]}
                </p>
                <h2>{japaneseIndustryCards[japanCard].title[locale]}</h2>
                <p>{japaneseIndustryCards[japanCard].copy[locale]}</p>
              </div>
              <div className="japan-carousel-actions">
                <div className="japan-carousel-controls">
                  <button
                    type="button"
                    onClick={() =>
                      setJapanCard(
                        (current) =>
                          (current - 1 + japaneseIndustryCards.length) %
                          japaneseIndustryCards.length,
                      )
                    }
                    aria-label={t('Previous principle', 'اصل قبلی')}
                  >
                    <ChevronLeft size={17} aria-hidden="true" />
                  </button>
                  <span aria-live="polite">
                    {japanCard + 1} / {japaneseIndustryCards.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setJapanCard(
                        (current) =>
                          (current + 1) % japaneseIndustryCards.length,
                      )
                    }
                    aria-label={t('Next principle', 'اصل بعدی')}
                  >
                    <ChevronRight size={17} aria-hidden="true" />
                  </button>
                </div>
                <Link
                  className="text-link"
                  href={`${href('resources')}?topic=japan`}
                >
                  {t('Explore the connection', 'کشف این ارتباط')}
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </section>
          </>
        ) : activeSection === 'data-science' ? (
          <DataSciencePage locale={locale} />
        ) : (
          <Suspense
            fallback={
              <p className="loading-state">
                {t('Loading the catalog…', 'در حال بارگذاری فهرست…')}
              </p>
            }
          >
            <Explorer locale={locale} section={activeSection} />
          </Suspense>
        )}
      </main>
      {audioPending && !sukunaActive && (
        <output className="domain-audio-status" aria-live="polite">
          <span aria-hidden="true" />
          {t('Domain expansion playing…', 'گسترش قلمرو در حال پخش است…')}
        </output>
      )}
      {sukunaPhase && (
        <div
          className={`sukuna-domain-expansion is-${sukunaPhase}`}
          role="presentation"
        >
          <img
            src={withBasePath('/Sukuna-Domain-Expansion.svg')}
            alt=""
            aria-hidden="true"
          />
          <div className="sukuna-lights" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="sukuna-embers" aria-hidden="true">
            {SUKUNA_EMBERS.map((ember, index) => (
              <span
                key={index}
                style={
                  {
                    '--ember-x': ember.x,
                    '--ember-base': ember.base,
                    '--ember-size': ember.size,
                    '--ember-delay': ember.delay,
                    '--ember-duration': ember.duration,
                    '--ember-drift': ember.drift,
                    '--ember-rise': ember.rise,
                    '--ember-color': ember.color,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <div className="sukuna-reveal" aria-hidden="true" />
          <div className="sukuna-subtitles" aria-hidden="true">
            <p className="sukuna-subtitle sukuna-subtitle-domain">
              <span lang="en">Domain Expansion</span>
              <span lang="ja">領域展開</span>
            </p>
            <p className="sukuna-subtitle sukuna-subtitle-shrine">
              <span lang="en">Malevolent Shrine</span>
              <span lang="ja">伏魔御廚子</span>
            </p>
            <p className="sukuna-subtitle sukuna-subtitle-open">
              <span lang="en">Open!</span>
              <span lang="ja">開</span>
            </p>
          </div>
        </div>
      )}
      <footer className="site-footer">
        <div className="footer-main">
          <Link className="footer-brand" href={href('home')}>
            ISE DOMAIN<span>領域</span>
          </Link>
          <p>
            {t(
              'A personal exploration of engineering, anime & Japanese industry.',
              'کاوشی شخصی در مهندسی، انیمه و صنعت ژاپن.',
            )}
          </p>
          <a className="back-to-top" href="#top">
            {t('Back to top', 'بازگشت به بالا')}
            <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-meta">
          <p
            className="footer-credit"
            lang={fa ? 'fa' : 'en'}
            dir={fa ? 'rtl' : 'ltr'}
          >
            {fa ? (
              <>
                توسعه یافته با 💜 توسط سینا رضایی (دانشجوی کارشناسی مهندسی صنایع
                و سیستم‌ها)
              </>
            ) : (
              <>
                Developed with <span aria-label="love">💜</span> by Sina Rezaei
                <span className="student-note"> (ISE Bachelor Student)</span>
              </>
            )}
          </p>
          <nav className="social-links" aria-label="Sina Rezaei social media">
            <a
              className="social-link"
              href="https://github.com/sina-04"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <GitHubMark size={18} />
            </a>
            <a
              className="social-link"
              href="https://www.linkedin.com/in/sina-rezaei-062a30416"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <LinkedInMark />
            </a>
            <a
              className="social-link"
              href="https://x.com/Sina_41148"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              title="X"
            >
              <XMark />
            </a>
            <a
              className="social-link"
              href="https://t.me/InfiniteSoA"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              title="Telegram"
            >
              <TelegramMark />
            </a>
            <a
              className="social-link email-link"
              href="mailto:sina.rezaei.04@gmail.com"
              aria-label="Email Sina Rezaei"
              title="sina.rezaei.04@gmail.com"
            >
              <Mail size={18} />
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
