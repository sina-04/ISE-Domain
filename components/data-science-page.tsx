'use client';

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  RotateCcw,
  Route,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import Link from '@/components/site-link';
import { AIExposurePanel } from '@/components/ai-exposure';
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

function FoundationPanel({
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
      className="data-foundation-panel"
      aria-labelledby={`${tone}-foundation-title`}
    >
      <h2 id={`${tone}-foundation-title`}>{title[locale]}</h2>
      <ol>
        {items.map((item, index) => {
          return (
            <li key={item.en}>
              <span>
                <b>
                  {new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
                    minimumIntegerDigits: 2,
                  }).format(index + 1)}
                </b>
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
  const [merged, setMerged] = useState(false);

  function mergeFoundations() {
    setMerged(true);
  }

  function resetFoundations() {
    setMerged(false);
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
    <article className="data-science-page">
      <section className="data-study-hero" aria-labelledby="data-science-title">
        <Link className="text-link" href={`/${locale}/careers`}>
          <ArrowLeft size={17} aria-hidden="true" />
          {t('Back to career guide', 'بازگشت به راهنمای شغلی')}
        </Link>

        <header className="data-study-heading">
          <p className="overline">
            {merged
              ? t('MATHEMATICS × PROGRAMMING', 'ریاضیات × برنامه‌نویسی')
              : t('THE TWO FOUNDATIONS', 'دو بنیان اصلی')}
          </p>
          <h1 id="data-science-title">
            {merged
              ? t('Data Science', 'علم داده')
              : t(
                  'How data science comes together',
                  'علم داده چگونه شکل می‌گیرد؟',
                )}
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

        {!merged && (
          <div className="data-foundations">
            <FoundationPanel
              tone="red"
              title={foundations.mathematics.title}
              items={foundations.mathematics.items}
              locale={locale}
            />
            <FoundationPanel
              tone="blue"
              title={foundations.programming.title}
              items={foundations.programming.items}
              locale={locale}
            />
            <button
              className="primary-button data-connect-button"
              type="button"
              onClick={mergeFoundations}
            >
              {t('Connect the foundations', 'پیوند بنیان‌ها')}
            </button>
          </div>
        )}
        <output className="sr-only" aria-live="polite">
          {merged
            ? t(
                'Foundations connected. The Data Science guide is available below.',
                'بنیان‌ها پیوند خوردند. راهنمای علم داده در ادامه نمایش داده می‌شود.',
              )
            : ''}
        </output>

        {merged && (
          <section
            className="data-study-result"
            aria-label={t('Connected foundations', 'بنیان‌های پیوندخورده')}
          >
            <p>
              {t(
                'The foundations connect through statistical modeling, programming, and decisions made with data.',
                'این بنیان‌ها با مدل‌سازی آماری، برنامه‌نویسی و تصمیم‌گیری بر پایه داده به هم پیوند می‌خورند.',
              )}
            </p>
            <button
              type="button"
              className="secondary-button"
              onClick={resetFoundations}
            >
              <RotateCcw size={16} aria-hidden="true" />
              {t('Revisit foundations', 'بازگشت به بنیان‌ها')}
            </button>
            <a className="text-link" href="#data-science-details">
              {t('Enter the field', 'ورود به حوزه')}
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </section>
        )}
      </section>

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
