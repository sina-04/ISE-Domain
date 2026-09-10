import courseData from './data/courses.json';
import pathwayData from './data/pathways.json';
import toolData from './data/tools.json';
import careerData from './data/careers.json';
import aiExposureData from './data/ai-exposure.json';
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
export interface CareerSource {
  label: Text;
  url: string;
}
export interface CareerProfile {
  id: string;
  domainId: string;
  supplemental: boolean;
  name: Text;
  abbreviation: string;
  summary: Text;
  iseFit: Text;
  dayInLife: Text;
  responsibilities: { en: string[]; fa: string[] };
  skills: { en: string[]; fa: string[] };
  tools: string[];
  entrySteps: { en: string[]; fa: string[] };
  progression: { en: string[]; fa: string[] };
  relatedRoles: { en: string[]; fa: string[] };
  source: CareerSource | null;
  aiExposure: AIExposure;
}
export interface AIExposure {
  careerId: string;
  score: number;
  occupation: string;
  sourceScore: number;
  globalRank: number;
  estimated: boolean;
}
export interface CareerTrack {
  id: string;
  name: Text;
  domainIds: string[];
}
export interface CareerDomain {
  id: string;
  trackId: string;
  name: Text;
  careerIds: string[];
}
export const courses = courseData as Course[];
export const undergraduate = courses.filter((c) => c.group !== 'supplementary');
export const pathways = pathwayData as Pathway[];
export const tools = toolData as Tool[];
export const careerTracks = careerData.tracks as CareerTrack[];
export const careerDomains = careerData.domains as CareerDomain[];
const aiExposureByCareerId = Object.fromEntries(
  (aiExposureData as AIExposure[]).map((item) => [item.careerId, item]),
);
export const careers = careerData.careers.map((career) => ({
  ...career,
  aiExposure: aiExposureByCareerId[career.id],
})) as CareerProfile[];
export const careerById = Object.fromEntries(careers.map((c) => [c.id, c]));
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
