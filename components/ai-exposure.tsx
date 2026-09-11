import { BrainCircuit, ExternalLink } from 'lucide-react';
import type { AIExposure } from '@/lib/catalog';
import type { Locale } from '@/lib/domain-config';

const rankingUrl = 'https://ai-exposure-us.tiiny.site/';

const exposureLevels = {
  10: { en: 'Extreme', fa: 'بسیار شدید' },
  9: { en: 'Very high', fa: 'بسیار زیاد' },
  8: { en: 'High', fa: 'زیاد' },
  7: { en: 'High–moderate', fa: 'متوسط رو به زیاد' },
  6: { en: 'Moderate', fa: 'متوسط' },
  5: { en: 'Balanced', fa: 'متعادل' },
  4: { en: 'Moderate–low', fa: 'متوسط رو به کم' },
  3: { en: 'Low', fa: 'کم' },
  2: { en: 'Very low', fa: 'بسیار کم' },
  1: { en: 'Minimal', fa: 'حداقلی' },
} as const;

function scoreText(score: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(
    score,
  );
}

export function AIExposureBadge({
  exposure,
  locale,
}: {
  exposure: AIExposure;
  locale: Locale;
}) {
  const t = (en: string, fa: string) => (locale === 'fa' ? fa : en);
  return (
    <span
      className="ai-exposure-badge"
      title={`${t('AI Exposure', 'میزان مواجهه با هوش مصنوعی')}: ${scoreText(exposure.score, locale)}/${scoreText(10, locale)}`}
    >
      <BrainCircuit size={13} aria-hidden="true" />
      {t('AI Exposure', 'مواجهه با AI')}{' '}
      <b>
        {scoreText(exposure.score, locale)}/{scoreText(10, locale)}
      </b>
    </span>
  );
}

export function AIExposurePanel({
  exposure,
  locale,
}: {
  exposure: AIExposure;
  locale: Locale;
}) {
  const fa = locale === 'fa';
  const t = (en: string, per: string) => (fa ? per : en);
  const level = exposureLevels[exposure.score as keyof typeof exposureLevels];

  return (
    <section className="ai-exposure-panel" aria-labelledby="ai-exposure-title">
      <div className="ai-exposure-heading">
        <BrainCircuit size={22} aria-hidden="true" />
        <div>
          <span id="ai-exposure-title">
            {t('AI Exposure', 'میزان مواجهه با هوش مصنوعی')}
          </span>
          <strong>
            {scoreText(exposure.score, locale)}/{scoreText(10, locale)} ·{' '}
            {level[locale]}
          </strong>
        </div>
      </div>
      <meter min="1" max="10" value={exposure.score}>
        {t(
          `${scoreText(exposure.score, locale)} out of ${scoreText(10, locale)}`,
          `${scoreText(exposure.score, locale)} از ${scoreText(10, locale)}`,
        )}
      </meter>
      <p>
        {exposure.estimated ? (
          <>
            {t(
              'Estimated from the related ranked occupation',
              'برآوردشده بر پایه شغل نزدیک',
            )}{' '}
            <bdi className="ai-exposure-occupation" dir="ltr">
              “{exposure.occupation}”
            </bdi>{' '}
            {t(
              `(source score ${exposure.sourceScore}/10, rank #${exposure.globalRank}).`,
              `(امتیاز منبع ${scoreText(exposure.sourceScore, locale)} از ۱۰، رتبه ${scoreText(exposure.globalRank, locale)}).`,
            )}
          </>
        ) : (
          <>
            {t('Matched to', 'مطابق با')}{' '}
            <bdi className="ai-exposure-occupation" dir="ltr">
              “{exposure.occupation}”
            </bdi>{' '}
            {t(
              `in the ranking (rank #${exposure.globalRank}).`,
              `در رتبه‌بندی (رتبه ${scoreText(exposure.globalRank, locale)}).`,
            )}
          </>
        )}
      </p>
      <small>
        {t(
          'Exposure describes how strongly AI may reshape the task mix, not whether the job will disappear.',
          'مواجهه نشان می‌دهد هوش مصنوعی تا چه حد می‌تواند ترکیب وظایف را تغییر دهد، نه اینکه شغل حذف خواهد شد.',
        )}
      </small>
      <a href={rankingUrl} target="_blank" rel="noopener noreferrer">
        {t('View source ranking', 'مشاهده رتبه‌بندی منبع')}
        <ExternalLink size={13} aria-hidden="true" />
      </a>
    </section>
  );
}
