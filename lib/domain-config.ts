export type Locale = 'en' | 'fa';
export type Text = { en: string; fa: string };
export const bilingual = (en: string, fa: string): Text => ({ en, fa });
export const categories = [
  {
    id: 'core',
    title: bilingual('Industrial Engineering Core', 'هسته مرکزی مهندسی صنایع'),
    caption: bilingual(
      'Production, quality, logistics, and systems.',
      'تولید، کیفیت، لجستیک و سیستم‌ها.',
    ),
    asset: '/art/industrial-core.svg',
    position: '50% 30%',
    mobilePosition: '50% 30%',
    color: '#a697ff',
    number: '01',
  },
  {
    id: 'math',
    title: bilingual('Mathematics', 'ریاضیات'),
    caption: bilingual(
      'Probability, optimization, and analytical foundations.',
      'احتمال، بهینه‌سازی و مبانی تحلیلی.',
    ),
    asset: '/art/mathematics.svg',
    position: '50% 30%',
    mobilePosition: '50% 30%',
    color: '#ef9c9c',
    number: '02',
  },
  {
    id: 'programming',
    title: bilingual('Programming and Software', 'برنامه‌نویسی و نرم‌افزار'),
    caption: bilingual(
      'Programming, data, and information systems.',
      'برنامه‌نویسی، داده و سیستم‌های اطلاعاتی.',
    ),
    asset: '/art/programming.svg',
    position: '50% 30%',
    mobilePosition: '50% 30%',
    color: '#a4c8ac',
    number: '03',
  },
  {
    id: 'management',
    title: bilingual('Humanities and Management', 'علوم انسانی و مدیریت'),
    caption: bilingual(
      'People, organizations, and management.',
      'انسان‌ها، سازمان‌ها و مدیریت.',
    ),
    asset: '/art/management.svg',
    position: '50% 30%',
    mobilePosition: '50% 30%',
    color: '#a8cbe5',
    number: '04',
  },
  {
    id: 'finance',
    title: bilingual('Economics and Finance', 'اقتصاد و امور مالی'),
    caption: bilingual(
      'Costs, accounting, and investment decisions.',
      'هزینه، حسابداری و تصمیم‌های سرمایه‌گذاری.',
    ),
    asset: '/art/finance.svg',
    position: '50% 30%',
    mobilePosition: '50% 30%',
    color: '#d7bd81',
    number: '05',
  },
  {
    id: 'other',
    title: bilingual('Engineering Foundations', 'مکانیک و برق'),
    caption: bilingual(
      'Mechanics, materials, and electrical systems.',
      'مکانیک، مواد و سیستم‌های الکتریکی.',
    ),
    asset: '/art/engineering-foundations.svg',
    position: '50% 30%',
    mobilePosition: '50% 30%',
    color: '#b6b9cf',
    number: '06',
  },
  {
    id: 'product',
    title: bilingual('Product and Business', 'محصول و کسب‌وکار'),
    caption: bilingual(
      'Products, markets, and entrepreneurship.',
      'محصول، بازار و کارآفرینی.',
    ),
    asset: '/art/product-business.svg',
    position: '72% 35%',
    mobilePosition: '72% 35%',
    color: '#d9a4d8',
    number: '07',
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
