import { bilingual as b, type Text } from './domain-config';
export interface Resource {
  id: string;
  title: Text;
  author: Text;
  description: Text;
  type: 'book' | 'blog' | 'official' | 'learning';
  language: string;
  url: string;
  categories: string[];
  japan?: boolean;
  pdfPage?: number;
}
export const resources: Resource[] = [
  {
    id: 'python-book',
    title: b('Python for Data Analysis', 'پایتون برای تحلیل داده'),
    author: b('Wes McKinney · 3rd edition', 'وس مک‌کینی · ویرایش سوم'),
    description: b(
      'An open-access guide to working with data using Python and pandas. Listed in the curriculum’s BI reading list.',
      'راهنمای دسترسی آزاد کار با داده در پایتون و pandas؛ معرفی‌شده در فهرست منابع درس هوشمندی کسب‌وکار.',
    ),
    type: 'book',
    language: 'en',
    url: 'https://wesmckinney.com/book/',
    categories: ['programming'],
    pdfPage: 128,
  },
  {
    id: 'warehouse-book',
    title: b('The Data Warehouse Toolkit', 'ابزارهای انبار داده'),
    author: b(
      'Ralph Kimball & Margy Ross · 3rd edition',
      'رالف کیمبال و مارگی راس · ویرایش سوم',
    ),
    description: b(
      'Understand dimensional modeling and the structure behind business intelligence systems.',
      'شناخت مدل‌سازی بُعدی و ساختار زیربنایی سیستم‌های هوش تجاری.',
    ),
    type: 'book',
    language: 'en',
    url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/',
    categories: ['programming'],
    pdfPage: 128,
  },
  {
    id: 'persian-quality',
    title: b(
      'Statistical Quality Control — Persian reference',
      'کنترل کیفیت آماری',
    ),
    author: b(
      'Douglas Montgomery · translated by Rasoul Noorossana',
      'داگلاس مونتگومری · ترجمه رسول نورالسنا',
    ),
    description: b(
      'A Persian reading recommendation for statistical quality control. Open the curriculum bibliography for the supplied reference.',
      'منبع فارسی پیشنهادی کنترل کیفیت آماری؛ برای مشخصات ارجاع، فهرست منابع برنامه درسی را ببینید.',
    ),
    type: 'book',
    language: 'fa',
    url: '/curriculum-1403.pdf#page=53',
    categories: ['core', 'math'],
    pdfPage: 53,
  },
  {
    id: 'persian-or',
    title: b(
      'Introduction to Operations Research — Persian reference',
      'آشنایی با تحقیق در عملیات',
    ),
    author: b(
      'Hamdy Taha · translated by Mohammad Bagher Bazargan',
      'حمدی طه · ترجمه محمدباقر بازرگان',
    ),
    description: b(
      'A Persian operations research reference listed in the national curriculum. The link opens its bibliography, not a book download.',
      'منبع فارسی تحقیق در عملیات معرفی‌شده در برنامه درسی؛ پیوند، فهرست منابع را باز می‌کند و فایل کتاب نیست.',
    ),
    type: 'book',
    language: 'fa',
    url: '/curriculum-1403.pdf#page=57',
    categories: ['math'],
    pdfPage: 57,
  },
  {
    id: 'iise-bok',
    title: b('ISE Body of Knowledge', 'پیکره دانش مهندسی صنایع و سیستم‌ها'),
    author: b(
      'Institute of Industrial & Systems Engineers',
      'مؤسسه مهندسان صنایع و سیستم‌ها',
    ),
    description: b(
      'A professional map of the field’s knowledge areas, useful for seeing how your courses fit together.',
      'نقشه حرفه‌ای حوزه‌های دانش رشته برای شناخت ارتباط میان درس‌ها.',
    ),
    type: 'official',
    language: 'en',
    url: 'https://www.iise.org/Details.aspx?id=43631',
    categories: ['core', 'management'],
  },
  {
    id: 'curriculum',
    title: b('Undergraduate Curriculum · 1403', 'برنامه درسی کارشناسی · ۱۴۰۳'),
    author: b(
      'Ministry of Science, Research and Technology',
      'وزارت علوم، تحقیقات و فناوری',
    ),
    description: b(
      'The supplied national curriculum with syllabi, prerequisites and reading lists. This site retains the Excel catalog as its organizing source.',
      'برنامه درسی ارائه‌شده شامل سرفصل‌ها، پیش‌نیازها و منابع؛ مبنای سازمان‌دهی فهرست این سایت همچنان کاربرگ اکسل است.',
    ),
    type: 'official',
    language: 'fa',
    url: '/curriculum-1403.pdf',
    categories: [],
  },
  {
    id: 'toyota-tps',
    title: b('Toyota Production System', 'سیستم تولید تویوتا'),
    author: b('Toyota Motor Corporation', 'شرکت تویوتا'),
    description: b(
      'See how Just-in-Time and jidoka connect production flow, inventory and quality. Read the explanation from Toyota itself.',
      'ارتباط تولید به‌موقع و جیدوکا با جریان تولید، موجودی و کیفیت را در توضیح رسمی تویوتا بخوانید.',
    ),
    type: 'official',
    language: 'en',
    url: 'https://global.toyota/en/company/vision-and-philosophy/production-system/',
    categories: ['core', 'management'],
    japan: true,
  },
  {
    id: 'toyota-tour',
    title: b('Inside Toyota’s Production System', 'درون سیستم تولید تویوتا'),
    author: b('Toyota · Virtual Plant Tour', 'تویوتا · بازدید مجازی کارخانه'),
    description: b(
      'Follow practical examples of flow and problem detection, then connect them to your production and quality courses.',
      'نمونه‌های عملی جریان کار و تشخیص مسئله را دنبال کنید و به دروس تولید و کیفیت پیوند دهید.',
    ),
    type: 'learning',
    language: 'en',
    url: 'https://global.toyota/en/company/plant-tours/production-system/',
    categories: ['core'],
    japan: true,
  },
  {
    id: 'lean-post',
    title: b('The Lean Post', 'لین پست'),
    author: b('Lean Enterprise Institute', 'مؤسسه لین'),
    description: b(
      'Practitioner articles about lean thinking, leadership and continuous improvement.',
      'مقاله‌های فعالان حرفه‌ای درباره تفکر ناب، رهبری و بهبود مستمر.',
    ),
    type: 'blog',
    language: 'en',
    url: 'https://www.lean.org/the-lean-post/articles/',
    categories: ['core', 'management'],
    japan: true,
  },
  {
    id: 'mit-linear',
    title: b('Linear Algebra · OpenCourseWare', 'جبر خطی · آموزش آزاد MIT'),
    author: b('MIT · Gilbert Strang', 'MIT · گیلبرت استرنگ'),
    description: b(
      'Lectures and exercises on vectors, matrices and linear systems to strengthen your mathematical foundation.',
      'درس‌گفتار و تمرین درباره بردار، ماتریس و دستگاه خطی برای تقویت پایه ریاضی.',
    ),
    type: 'learning',
    language: 'en',
    url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
    categories: ['math'],
  },
  {
    id: 'ortools',
    title: b('Optimization with OR-Tools', 'بهینه‌سازی با OR-Tools'),
    author: b('Google for Developers', 'گوگل برای توسعه‌دهندگان'),
    description: b(
      'Official examples for routing, scheduling and mathematical optimization.',
      'نمونه‌های رسمی مسیریابی، زمان‌بندی و بهینه‌سازی ریاضی.',
    ),
    type: 'learning',
    language: 'en',
    url: 'https://developers.google.com/optimization',
    categories: ['math', 'programming'],
  },
  {
    id: 'python-tutorial',
    title: b('The Python Tutorial', 'آموزش پایتون'),
    author: b('Python Software Foundation', 'بنیاد نرم‌افزار پایتون'),
    description: b(
      'Start with the official language tutorial and practice the building blocks of programming.',
      'از آموزش رسمی زبان شروع کنید و مبانی برنامه‌نویسی را تمرین کنید.',
    ),
    type: 'learning',
    language: 'en',
    url: 'https://docs.python.org/3/tutorial/',
    categories: ['programming'],
  },
  {
    id: 'comfar',
    title: b('COMFAR & Investment Appraisal', 'COMFAR و ارزیابی سرمایه‌گذاری'),
    author: b('UNIDO', 'سازمان توسعه صنعتی ملل متحد'),
    description: b(
      'Connect engineering economy to financial and economic appraisal of industrial projects.',
      'پیوند اقتصاد مهندسی با ارزیابی مالی و اقتصادی طرح‌های صنعتی.',
    ),
    type: 'official',
    language: 'en',
    url: 'https://www.unido.org/comfar',
    categories: ['finance'],
  },
  {
    id: 'nist',
    title: b('Engineering Statistics Handbook', 'راهنمای آمار مهندسی'),
    author: b('NIST / SEMATECH', 'NIST / SEMATECH'),
    description: b(
      'A technical reference for measurement, statistical methods and process improvement.',
      'مرجع فنی اندازه‌گیری، روش‌های آماری و بهبود فرایند.',
    ),
    type: 'learning',
    language: 'en',
    url: 'https://www.itl.nist.gov/div898/handbook/',
    categories: ['math', 'core', 'other'],
  },
];
