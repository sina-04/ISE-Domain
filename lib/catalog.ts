import courseData from './data/courses.json';
import pathwayData from './data/pathways.json';
import toolData from './data/tools.json';
import { type Text, type Locale, normalizeSearch } from './domain-config';
export interface Source {
  file: string;
  sheet?: string;
  range?: string;
  page?: number;
  field?: string;
}
export interface WikiLink {
  title: string;
  url: string;
}
export interface Course {
  id: string;
  code: string | null;
  name: Text;
  credits: number;
  group: string;
  categories: string[];
  pathwayIds: string[];
  description: Text;
  sources: Source[];
  prerequisiteIds: string[];
  corequisiteIds: string[];
  standing: Text | null;
  wikipedia: {
    en: WikiLink | null;
    fa: WikiLink | null;
    relation: string;
    verifiedAt: string;
  };
}
export interface Pathway {
  id: string;
  name: Text;
  description: Text;
  skills: Text;
  careers: Text;
  courseIds: string[];
  supporting: boolean;
}
export interface Tool {
  id: string;
  name: string;
  url: string;
  description: Text;
  courseIds: string[];
  sources: Source[];
}
export const courses = courseData as Course[];
export const undergraduate = courses.filter((c) => c.group !== 'supplementary');
export const pathways = pathwayData as Pathway[];
export const tools = toolData as Tool[];
export const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));
export function courseMatches(course: Course, query: string) {
  return normalizeSearch(
    `${course.name.en} ${course.name.fa} ${course.code || ''}`,
  ).includes(normalizeSearch(query));
}
export function creditsFor(items: Course[]) {
  return [...new Map(items.map((c) => [c.id, c])).values()].reduce(
    (sum, c) => sum + c.credits,
    0,
  );
}
export function formatNumber(n: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(n);
}
