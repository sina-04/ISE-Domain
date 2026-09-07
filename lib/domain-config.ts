export type Locale = 'en' | 'fa';
export type Text = { en: string; fa: string };
export const bilingual = (en: string, fa: string): Text => ({ en, fa });
export const categories = [
  {
    id: 'finance',
    title: bilingual('Economics & Finance', 'اقتصاد و امور مالی'),
    character: bilingual('Kento Nanami', 'کنتو نانامی'),
    caption: bilingual(
      'Find the value in every decision.',
      'ارزش هر تصمیم را پیدا کنید.',
    ),
    asset: '/Kento-Nanami.svg',
    position: '60% 45%',
    mobilePosition: '64% 50%',
    color: '#d7bd81',
    number: '01',
  },
  {
    id: 'management',
    title: bilingual('Humanities & Management', 'علوم انسانی و مدیریت'),
    character: bilingual('Mei Mei', 'می می'),
    caption: bilingual(
      'Understand the people behind systems.',
      'انسان‌های پشت سیستم‌ها را بشناسید.',
    ),
    asset: '/Mei-Mei.svg',
    position: '60% 40%',
    mobilePosition: '65% 45%',
    color: '#a8cbe5',
    number: '02',
  },
  {
    id: 'core',
    title: bilingual('Industrial Engineering Core', 'هسته مرکزی مهندسی صنایع'),
    character: bilingual('Satoru Gojo', 'ساتورو گوجو'),
    caption: bilingual(
      'Build better. Think beyond limits.',
      'بهتر بسازید؛ فراتر از محدودیت‌ها بیندیشید.',
    ),
    asset: '/Satoru-Gojo-ISE.svg',
    position: '60% 50%',
    mobilePosition: '65% 50%',
    color: '#a697ff',
    number: '03',
  },
  {
    id: 'math',
    title: bilingual('Mathematics', 'ریاضیات'),
    character: bilingual('Ryomen Sukuna', 'ریومن سوکونا'),
    caption: bilingual(
      'Master the language of possibility.',
      'زبان احتمال و امکان را بیاموزید.',
    ),
    asset: '/Ryomen-Sukuna.svg',
    position: '50% 30%',
    mobilePosition: '50% 25%',
    color: '#ef9c9c',
    number: '04',
  },
  {
    id: 'programming',
    title: bilingual('Programming & Software', 'برنامه‌نویسی و نرم‌افزار'),
    character: bilingual('Toji Fushiguro', 'توجی فوشیگورو'),
    caption: bilingual(
      'Turn your ideas into working tools.',
      'ایده‌هایتان را به ابزارهای کاربردی تبدیل کنید.',
    ),
    asset: '/Toji-Fushiguro.svg',
    position: '60% 40%',
    mobilePosition: '65% 50%',
    color: '#a4c8ac',
    number: '05',
  },
  {
    id: 'other',
    title: bilingual('Engineering Foundations', 'مکانیک و برق'),
    character: bilingual('Mechanical & Electrical', 'دروس مکانیک و برق'),
    caption: bilingual(
      'Know how the physical world works.',
      'کارکرد جهان فیزیکی را بشناسید.',
    ),
    asset: '',
    position: 'center',
    mobilePosition: 'center',
    color: '#b6b9cf',
    number: '06',
  },
];
export const officialGroups = [
  { id: 'foundation', title: bilingual('Foundational', 'پایه'), credits: 21 },
  {
    id: 'mandatory',
    title: bilingual('Mandatory specialized', 'تخصصی الزامی'),
    credits: 66,
  },
  {
    id: 'elective',
    title: bilingual('Specialized electives', 'تخصصی انتخابی'),
    credits: 22,
  },
  {
    id: 'general',
    title: bilingual('General education', 'عمومی'),
    credits: 22,
  },
  {
    id: 'employability',
    title: bilingual('Employability skills', 'مهارتی و اشتغال‌پذیری'),
    credits: 6,
  },
  {
    id: 'project',
    title: bilingual('Undergraduate project', 'پروژه کارشناسی'),
    credits: 3,
  },
];
export function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632))
    .replace(/[\u200c\s\-–—]+/g, '')
    .replace(/[ًٌٍَُِّْ]/g, '');
}
