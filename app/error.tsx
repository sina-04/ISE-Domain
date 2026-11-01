'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  const fa =
    typeof document !== 'undefined' && document.documentElement.lang === 'fa';
  return (
    <main
      className="error-state"
      lang={fa ? 'fa' : 'en'}
      dir={fa ? 'rtl' : 'ltr'}
    >
      <h1>{fa ? 'این بخش بارگذاری نشد' : 'This section could not load'}</h1>
      <p>
        {fa
          ? 'دوباره تلاش کنید. اگر مشکل ادامه داشت، صفحه را تازه‌سازی کنید.'
          : 'Try again. If the problem continues, refresh the page.'}
      </p>
      <button type="button" className="primary-button" onClick={reset}>
        {fa ? 'تلاش دوباره' : 'Try again'}
      </button>
    </main>
  );
}
