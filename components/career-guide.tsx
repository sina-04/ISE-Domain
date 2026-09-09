'use client';

import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  BookOpen,
  CheckCircle2,
  Compass,
  Network,
  Route,
  Wrench,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from '@/components/site-link';
import {
  careerById,
  careerDomains,
  careerTracks,
  type CareerProfile,
} from '@/lib/catalog';
import type { Locale } from '@/lib/domain-config';
import { resourcesForCareer } from '@/lib/resources';

function CareerCard({
  career,
  locale,
  number,
  onOpen,
}: {
  career: CareerProfile;
  locale: Locale;
  number: string;
  onOpen: (career: CareerProfile) => void;
}) {
  const t = (en: string, fa: string) => (locale === 'fa' ? fa : en);
  return (
    <button
      type="button"
      className="career-card"
      onClick={() => onOpen(career)}
      aria-label={`${t('Open career guide for', 'باز کردن راهنمای شغلی')} ${career.name[locale]}`}
    >
      <span className="career-card-number">{number}</span>
      <span className="career-card-icon" aria-hidden="true">
        <BriefcaseBusiness size={20} />
      </span>
      <span className="career-card-copy">
        {career.abbreviation && (
          <span className="career-card-kicker">{career.abbreviation}</span>
        )}
        <strong>{career.name[locale]}</strong>
        <span>{career.summary[locale]}</span>
      </span>
      <span className="career-card-skills">
        {career.skills[locale].slice(0, 2).join(' · ')}
      </span>
      <span
        className={`card-resource-badge career-resource-badge ${resourcesForCareer(career.id).length ? 'has-resources' : ''}`}
      >
        <BookOpen size={13} aria-hidden="true" />
        {t('Resources', 'منابع')}
        {resourcesForCareer(career.id).length > 0 && (
          <small>{resourcesForCareer(career.id).length}</small>
        )}
      </span>
      <ArrowUpRight
        className="career-card-arrow"
        size={18}
        aria-hidden="true"
      />
    </button>
  );
}

export function CareerGuide({
  locale,
  selectedCareer,
  returnFocus,
  alternateUrl,
  onOpen,
  onClose,
}: {
  locale: Locale;
  selectedCareer?: CareerProfile;
  returnFocus: HTMLElement | null;
  alternateUrl: string;
  onOpen: (career: CareerProfile) => void;
  onClose: () => void;
}) {
  const t = (en: string, fa: string) => (locale === 'fa' ? fa : en);

  return (
    <>
      <section className="career-map" aria-labelledby="career-map-title">
        <div className="career-map-intro">
          <p className="overline">
            {t('YOUR CAREER MAP', 'نقشه مسیر شغلی شما')}
          </p>
          <h2 id="career-map-title">
            {t(
              'Two branches. Ten domains. Many ways forward.',
              'دو شاخه، ده حوزه و مسیرهای گوناگون برای آینده.',
            )}
          </h2>
          <p>
            {t(
              'Start with a domain that matches the problems you enjoy solving, then open any role for a practical path from university to work.',
              'از حوزه‌ای شروع کنید که با مسئله‌های مورد علاقه شما هماهنگ است؛ سپس هر نقش را باز کنید تا مسیر عملی دانشگاه تا کار را ببینید.',
            )}
          </p>
          <div
            className="career-map-counts"
            aria-label={t('Career guide totals', 'آمار راهنمای شغلی')}
          >
            <span>
              <strong>{locale === 'fa' ? '۱۰' : '10'}</strong>
              {t('domains', 'حوزه')}
            </span>
            <span>
              <strong>{locale === 'fa' ? '۳۰' : '30'}</strong>
              {t('career paths', 'مسیر شغلی')}
            </span>
          </div>
        </div>
        <nav
          className="career-tree"
          aria-label={t('Career domain tree', 'درخت حوزه‌های شغلی')}
        >
          <div className="career-tree-root">
            <Network size={18} aria-hidden="true" />
            <span>
              {t('Career & Professional Domains', 'حوزه‌های شغلی و حرفه‌ای')}
            </span>
          </div>
          <ol className="career-tree-tracks">
            {careerTracks.map((track, trackIndex) => {
              const domainGroups =
                track.id === 'traditional'
                  ? [track.domainIds.slice(0, 3), track.domainIds.slice(3)]
                  : [track.domainIds];

              return (
                <li
                  className={`career-tree-track career-tree-track-${track.id}`}
                  key={track.id}
                >
                  <div className="career-tree-track-heading">
                    <span>{String(trackIndex + 1).padStart(2, '0')}</span>
                    <strong>{track.name[locale]}</strong>
                  </div>
                  <div className="career-tree-domain-columns">
                    {domainGroups.map((domainIds, groupIndex) => (
                      <ol
                        className="career-tree-domains"
                        key={`${track.id}-${groupIndex}`}
                      >
                        {domainIds.map((domainId) => {
                          const domainIndex = track.domainIds.indexOf(domainId);
                          const domain = careerDomains.find(
                            (item) => item.id === domainId,
                          )!;
                          return (
                            <li key={domain.id}>
                              <a href={`#career-domain-${domain.id}`}>
                                <span>
                                  {trackIndex + 1}.{domainIndex + 1}
                                </span>
                                <strong>{domain.name[locale]}</strong>
                              </a>
                              <ul>
                                {domain.careerIds.map((id) => {
                                  const career = careerById[id];
                                  return (
                                    <li key={id}>
                                      <button
                                        type="button"
                                        onClick={() => onOpen(career)}
                                      >
                                        {career.name[locale]}
                                        {career.abbreviation && (
                                          <small>{career.abbreviation}</small>
                                        )}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })}
                      </ol>
                    ))}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </section>

      <div className="career-track-list">
        {careerTracks.map((track, trackIndex) => (
          <section className="career-track-section" key={track.id}>
            <div className="career-track-heading">
              <span>{String(trackIndex + 1).padStart(2, '0')}</span>
              <div>
                <p className="overline">
                  {t('ISE CAREER BRANCH', 'شاخه مسیرهای مهندسی صنایع')}
                </p>
                <h2>{track.name[locale]}</h2>
              </div>
            </div>
            <div className="career-domain-list">
              {track.domainIds.map((domainId, domainIndex) => {
                const domain = careerDomains.find(
                  (item) => item.id === domainId,
                )!;
                return (
                  <section
                    className="career-domain-section"
                    id={`career-domain-${domain.id}`}
                    key={domain.id}
                  >
                    <div className="career-domain-heading">
                      <span>
                        {trackIndex + 1}.{domainIndex + 1}
                      </span>
                      <div>
                        <p className="overline">
                          {t('PROFESSIONAL DOMAIN', 'حوزه حرفه‌ای')}
                        </p>
                        <h3>{domain.name[locale]}</h3>
                      </div>
                      <small>
                        {new Intl.NumberFormat(
                          locale === 'fa' ? 'fa-IR' : 'en-US',
                        ).format(domain.careerIds.length)}{' '}
                        {t('paths', 'مسیر')}
                      </small>
                    </div>
                    <div className="career-card-grid">
                      {domain.careerIds.map((id, careerIndex) => (
                        <CareerCard
                          key={id}
                          career={careerById[id]}
                          locale={locale}
                          number={`${trackIndex + 1}.${domainIndex + 1}.${careerIndex + 1}`}
                          onOpen={onOpen}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <CareerDialog
        career={selectedCareer}
        locale={locale}
        returnFocus={returnFocus}
        alternateUrl={alternateUrl}
        onClose={onClose}
      />
    </>
  );
}

function CareerDialog({
  career,
  locale,
  returnFocus,
  alternateUrl,
  onClose,
}: {
  career?: CareerProfile;
  locale: Locale;
  returnFocus: HTMLElement | null;
  alternateUrl: string;
  onClose: () => void;
}) {
  const t = (en: string, fa: string) => (locale === 'fa' ? fa : en);
  const domain = careerDomains.find((item) => item.id === career?.domainId);
  const list = (items: string[]) => (
    <ul className="career-detail-list">
      {items.map((item) => (
        <li key={item}>
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <Dialog
      open={!!career}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        lang={locale}
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
        finalFocus={() => returnFocus}
        className="career-dialog"
        showCloseButton={false}
      >
        {career && (
          <>
            <div className="career-dialog-header">
              <span className="career-dialog-orbit" aria-hidden="true" />
              <Link
                className="career-dialog-language"
                href={alternateUrl}
                lang={locale === 'en' ? 'fa' : 'en'}
              >
                {t('فارسی', 'English')}
              </Link>
              <DialogClose
                className="dialog-close"
                aria-label={t('Close career guide', 'بستن راهنمای شغلی')}
              >
                <X size={21} />
              </DialogClose>
              <div className="career-dialog-meta">
                {career.abbreviation && <span>{career.abbreviation}</span>}
                <span>{domain?.name[locale]}</span>
              </div>
              <DialogTitle>{career.name[locale]}</DialogTitle>
              <DialogDescription>{career.summary[locale]}</DialogDescription>
            </div>
            <div className="career-dialog-body">
              <div className="career-fit-note">
                <Compass size={20} aria-hidden="true" />
                <div>
                  <strong>
                    {t('Why it fits ISE', 'چرا برای مهندسی صنایع مناسب است؟')}
                  </strong>
                  <p>{career.iseFit[locale]}</p>
                </div>
              </div>

              <section>
                <h3>
                  <BriefcaseBusiness size={18} />
                  {t('A day in this role', 'یک روز در این نقش')}
                </h3>
                <p>{career.dayInLife[locale]}</p>
              </section>
              <div className="career-detail-columns">
                <section>
                  <h3>
                    <CheckCircle2 size={18} />
                    {t('Core responsibilities', 'مسئولیت‌های اصلی')}
                  </h3>
                  {list(career.responsibilities[locale])}
                </section>
                <section>
                  <h3>
                    <Wrench size={18} />
                    {t('Skills to build', 'مهارت‌های مورد نیاز')}
                  </h3>
                  {list(career.skills[locale])}
                  <div className="career-tool-list">
                    {career.tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                </section>
              </div>
              <section>
                <h3>
                  <Route size={18} />
                  {t('How to enter the field', 'چگونه وارد این حوزه شوید؟')}
                </h3>
                <ol className="career-step-list">
                  {career.entrySteps[locale].map((step, index) => (
                    <li key={step}>
                      <span>{index + 1}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </section>
              <section>
                <h3>
                  <ArrowRight size={18} />
                  {t('Typical progression', 'مسیر پیشرفت معمول')}
                </h3>
                <div className="career-progression">
                  {career.progression[locale].map((step, index) => (
                    <span key={step}>
                      {step}
                      {index < career.progression[locale].length - 1 && (
                        <ArrowRight size={15} aria-hidden="true" />
                      )}
                    </span>
                  ))}
                </div>
              </section>
              <section>
                <h3>{t('Related roles', 'نقش‌های مرتبط')}</h3>
                <div className="career-tool-list">
                  {career.relatedRoles[locale].map((role) => (
                    <span key={role}>{role}</span>
                  ))}
                </div>
              </section>
              <section>
                <h3>
                  <BookOpen size={18} />
                  {t('Resources', 'منابع')}
                </h3>
                {resourcesForCareer(career.id).length > 0 ? (
                  <div className="dialog-resource-list">
                    {resourcesForCareer(career.id).map((resource) => (
                      <a
                        className="out-link"
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.title[locale]}
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <Link
                    className="dialog-resource-browse"
                    href={`/${locale}/resources?based=careers`}
                  >
                    {t('Browse career resources', 'مشاهده منابع شغلی')}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                )}
              </section>
              {career.source && (
                <a
                  className="career-source-link"
                  href={career.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {career.source.label[locale]}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
