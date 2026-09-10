'use client';
/* Supplied SVG artwork is intentionally rendered as full-bleed scene art. */
/* eslint-disable @next/next/no-img-element */

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Compass,
  RotateCcw,
  Route,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from '@/components/site-link';
import { AIExposurePanel } from '@/components/ai-exposure';
import { withBasePath } from '@/lib/base-path';
import { careerById } from '@/lib/catalog';
import type { Locale } from '@/lib/domain-config';

const foundations = {
  mathematics: {
    title: { en: 'Mathematics', fa: 'ریاضیات' },
    items: [
      { en: 'General Mathematics 1 & 2', fa: 'ریاضیات عمومی ۱ و ۲' },
      { en: 'Linear Algebra', fa: 'جبر خطی' },
      { en: 'Differential Equations', fa: 'معادلات دیفرانسیل' },
      { en: 'Numerical Analysis', fa: 'تحلیل عددی' },
      { en: 'Probability Theory', fa: 'نظریه احتمال' },
      { en: 'Statistics', fa: 'آمار' },
      { en: 'Principles of Simulation', fa: 'اصول شبیه‌سازی' },
    ],
  },
  programming: {
    title: { en: 'Programming & Software', fa: 'برنامه‌نویسی و نرم‌افزار' },
    items: [
      { en: 'Computer Programming', fa: 'برنامه‌سازی کامپیوتر' },
      { en: 'Principles of IT', fa: 'اصول فناوری اطلاعات' },
      {
        en: 'Foundation of ML and AI',
        fa: 'مبانی یادگیری ماشین و هوش مصنوعی',
      },
      { en: 'MIS', fa: 'سیستم‌های اطلاعات مدیریت' },
      { en: 'BI and Visualization', fa: 'هوش تجاری و دیداری‌سازی' },
    ],
  },
};

const energyParticles = Array.from({ length: 14 }, (_, index) => ({
  x: `${9 + ((index * 31) % 83)}%`,
  y: `${8 + ((index * 47) % 79)}%`,
  delay: `${(index % 7) * -0.34}s`,
  duration: `${2.4 + (index % 5) * 0.42}s`,
}));

function KnowledgeOrbit({
  tone,
  title,
  items,
  locale,
}: {
  tone: 'red' | 'blue';
  title: { en: string; fa: string };
  items: { en: string; fa: string }[];
  locale: Locale;
}) {
  return (
    <section
      className={`knowledge-orbit knowledge-orbit-${tone}`}
      aria-labelledby={`${tone}-foundation-title`}
      style={{ '--segment-count': items.length } as CSSProperties}
    >
      <div className="knowledge-orbit-ring" aria-hidden="true" />
      <div className="knowledge-core">
        {tone === 'red' ? (
          <Sparkles size={22} aria-hidden="true" />
        ) : (
          <Code2 size={22} aria-hidden="true" />
        )}
        <h2 id={`${tone}-foundation-title`}>{title[locale]}</h2>
      </div>
      <ol className="knowledge-orbit-items">
        {items.map((item, index) => {
          const angle = -90 + (360 / items.length) * index;
          return (
            <li
              key={item.en}
              style={
                {
                  '--orbit-angle': `${angle}deg`,
                  '--orbit-counter-angle': `${-angle}deg`,
                } as CSSProperties
              }
            >
              <span>
                <b>{String(index + 1).padStart(2, '0')}</b>
                {item[locale]}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function DataSciencePage({ locale }: { locale: Locale }) {
  const fa = locale === 'fa';
  const t = (en: string, per: string) => (fa ? per : en);
  const career = careerById['data-science'];
  const [mergePhase, setMergePhase] = useState<
    'foundations' | 'merging' | 'merged'
  >('foundations');
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'failed'>(
    'idle',
  );
  const activeAudio = useRef<HTMLAudioElement | null>(null);
  const mergeTimer = useRef<number | null>(null);
  const merging = mergePhase === 'merging';
  const merged = mergePhase === 'merged';

  useEffect(
    () => () => {
      if (mergeTimer.current !== null) {
        window.clearTimeout(mergeTimer.current);
      }
      activeAudio.current?.pause();
      activeAudio.current = null;
    },
    [],
  );

  function mergeFoundations() {
    if (mergePhase !== 'foundations') return;
    setMergePhase('merging');
    setAudioState('playing');

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    mergeTimer.current = window.setTimeout(
      () => {
        setMergePhase('merged');
        mergeTimer.current = null;
      },
      reduceMotion ? 40 : 2800,
    );

    const audio = new Audio(
      withBasePath('/audio/Satoru Gojo Hollow Purple-[AudioTrimmer.com].m4a'),
    );
    audio.preload = 'auto';
    activeAudio.current = audio;
    audio.addEventListener(
      'ended',
      () => {
        if (activeAudio.current === audio) {
          activeAudio.current = null;
          setAudioState('idle');
        }
      },
      { once: true },
    );
    void audio.play().catch(() => {
      if (activeAudio.current === audio) {
        activeAudio.current = null;
        setAudioState('failed');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetFoundations() {
    if (mergeTimer.current !== null) {
      window.clearTimeout(mergeTimer.current);
      mergeTimer.current = null;
    }
    activeAudio.current?.pause();
    activeAudio.current = null;
    setAudioState('idle');
    setMergePhase('foundations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const detailList = (items: string[]) => (
    <ul className="ds-detail-list">
      {items.map((item) => (
        <li key={item}>
          <CheckCircle2 size={17} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <article className={`data-science-page is-${mergePhase}`}>
      <section className="ds-hero" aria-labelledby="data-science-title">
        <img
          className="ds-scene-art ds-foundation-art"
          src={withBasePath('/Satoru-Gojo-Red-and-Blue.svg')}
          alt=""
          aria-hidden="true"
        />
        <img
          className="ds-scene-art ds-hollow-art"
          src={withBasePath('/Satoru-Gojo-Hollow-Purple.svg')}
          alt=""
          aria-hidden="true"
        />
        <div className="ds-scene-shade" aria-hidden="true" />
        <Link className="ds-back-link" href={`/${locale}/careers`}>
          <ArrowLeft size={17} aria-hidden="true" />
          {t('Back to career guide', 'بازگشت به راهنمای شغلی')}
        </Link>

        <header className="ds-scene-heading">
          <p className="overline">
            {merged
              ? t('MATHEMATICS × PROGRAMMING', 'ریاضیات × برنامه‌نویسی')
              : t('THE TWO FOUNDATIONS', 'دو بنیان اصلی')}
          </p>
          <h1 id="data-science-title">
            {merged
              ? t('HOLLOW PURPLE', 'بنفش توخالی')
              : t('BUILD THE DOMAIN', 'قلمرو را بسازید')}
            <span>.</span>
          </h1>
          <p>
            {merged
              ? t(
                  'When quantitative thinking meets computation, data becomes a field you can explore, model, and shape.',
                  'وقتی تفکر کمی با محاسبات ترکیب می‌شود، داده به قلمرویی برای کشف، مدل‌سازی و شکل‌دادن تبدیل می‌شود.',
                )
              : t(
                  'Bring quantitative reasoning and computational practice together.',
                  'استدلال کمی و مهارت محاسباتی را در کنار هم قرار دهید.',
                )}
          </p>
        </header>

        <div
          className="ds-foundation-map"
          aria-hidden={mergePhase !== 'foundations'}
        >
          <KnowledgeOrbit
            tone="red"
            title={foundations.mathematics.title}
            items={foundations.mathematics.items}
            locale={locale}
          />
          <KnowledgeOrbit
            tone="blue"
            title={foundations.programming.title}
            items={foundations.programming.items}
            locale={locale}
          />
          <button
            className="ds-merge-button"
            type="button"
            onClick={mergeFoundations}
            disabled={mergePhase !== 'foundations'}
          >
            <span>{t('MERGE!', 'ادغام!')}</span>
            <small>{t('Create the domain', 'خلق قلمرو')}</small>
          </button>
        </div>

        {merging && <div className="ds-merge-expansion" aria-hidden="true" />}

        {merged && (
          <div className="ds-purple-stage">
            <div className="ds-energy-field" aria-hidden="true">
              {energyParticles.map((particle, index) => (
                <span
                  key={index}
                  style={
                    {
                      '--particle-x': particle.x,
                      '--particle-y': particle.y,
                      '--particle-delay': particle.delay,
                      '--particle-duration': particle.duration,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="ds-purple-ring" aria-hidden="true" />
            <div className="ds-data-sphere">
              <span lang="ja">領域</span>
              <strong>{career.name[locale]}</strong>
            </div>
            <button
              type="button"
              className="ds-reset-button"
              onClick={resetFoundations}
            >
              <RotateCcw size={16} aria-hidden="true" />
              {t('Revisit foundations', 'بازگشت به بنیان‌ها')}
            </button>
            <a className="ds-scroll-cue" href="#data-science-details">
              {t('Enter the field', 'ورود به حوزه')}
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        )}
      </section>

      {audioState !== 'idle' && (
        <output className="ds-audio-status" aria-live="polite">
          <span aria-hidden="true" />
          {audioState === 'playing'
            ? t(
                'Hollow Purple sequence playing…',
                'سکانس بنفش توخالی در حال پخش است…',
              )
            : t(
                'The visual sequence is active; audio could not start.',
                'سکانس تصویری فعال است؛ پخش صدا آغاز نشد.',
              )}
        </output>
      )}

      {merged && (
        <section className="ds-detail-shell" id="data-science-details">
          <div className="ds-detail-intro">
            <p className="overline">{career.abbreviation} / DATA SCIENCE</p>
            <h2>{career.summary[locale]}</h2>
            <div className="ds-fit-note">
              <Compass size={22} aria-hidden="true" />
              <div>
                <strong>
                  {t('Why it fits ISE', 'چرا برای مهندسی صنایع مناسب است؟')}
                </strong>
                <p>{career.iseFit[locale]}</p>
              </div>
            </div>
            <AIExposurePanel exposure={career.aiExposure} locale={locale} />
          </div>

          <div className="ds-detail-grid">
            <section className="ds-detail-card ds-day-card">
              <p className="overline">{t('THE WORK', 'ماهیت کار')}</p>
              <h3>{t('A day in the field', 'یک روز در این حوزه')}</h3>
              <p>{career.dayInLife[locale]}</p>
            </section>
            <section className="ds-detail-card">
              <p className="overline">{t('RESPONSIBILITIES', 'مسئولیت‌ها')}</p>
              <h3>{t('What you will do', 'کارهایی که انجام می‌دهید')}</h3>
              {detailList(career.responsibilities[locale])}
            </section>
            <section className="ds-detail-card">
              <p className="overline">{t('CAPABILITIES', 'توانمندی‌ها')}</p>
              <h3>{t('Skills to build', 'مهارت‌هایی که باید بسازید')}</h3>
              {detailList(career.skills[locale])}
              <div className="ds-tool-list">
                {career.tools.map((tool) => (
                  <span key={tool}>
                    <Wrench size={13} aria-hidden="true" />
                    {tool}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <section className="ds-path-section">
            <div className="ds-path-heading">
              <Route size={22} aria-hidden="true" />
              <div>
                <p className="overline">{t('YOUR PATH', 'مسیر شما')}</p>
                <h2>{t('From foundations to practice', 'از بنیان تا عمل')}</h2>
              </div>
            </div>
            <ol className="ds-entry-steps">
              {career.entrySteps[locale].map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="ds-progression-section">
            <p className="overline">{t('PROGRESSION', 'مسیر پیشرفت')}</p>
            <div className="ds-progression">
              {career.progression[locale].map((step, index) => (
                <div key={step}>
                  <span>{step}</span>
                  {index < career.progression[locale].length - 1 && (
                    <ArrowRight size={18} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
            <div className="ds-related-roles">
              <strong>{t('Related roles', 'نقش‌های مرتبط')}</strong>
              {career.relatedRoles[locale].map((role) => (
                <span key={role}>{role}</span>
              ))}
            </div>
          </section>
        </section>
      )}
    </article>
  );
}
