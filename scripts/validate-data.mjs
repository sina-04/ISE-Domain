import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const json = (name) =>
  JSON.parse(
    readFileSync(new URL(`../lib/data/${name}.json`, import.meta.url), 'utf8'),
  );
const courses = json('courses'),
  tools = json('tools'),
  pathways = json('pathways'),
  careerData = json('careers');
const ids = new Set(courses.map((c) => c.id));
assert.equal(ids.size, courses.length, 'Duplicate course IDs');
assert.equal(courses.length, 84);
assert.equal(courses.filter((c) => c.group !== 'supplementary').length, 81);
const degree = {
  foundation: 21,
  mandatory: 66,
  elective: 22,
  general: 22,
  employability: 6,
  project: 3,
};
assert.equal(
  Object.values(degree).reduce((a, b) => a + b),
  140,
);
for (const [group, total] of Object.entries(degree))
  if (group !== 'elective')
    assert.equal(
      courses
        .filter((c) => c.group === group)
        .reduce((sum, c) => sum + c.credits, 0),
      total,
      group,
    );
assert.equal(
  courses
    .find((c) => c.id === 'ise-103')
    .categories.sort()
    .join(','),
  'finance,management',
);
const subjectTotals = {
  finance: [10, 2],
  management: [8, 0],
  core: [20, 23],
  math: [29, 3],
  programming: [7, 6],
  other: [14, 0],
};
for (const [category, expected] of Object.entries(subjectTotals)) {
  const members = courses.filter((c) => c.categories.includes(category));
  assert.deepEqual(
    [
      members
        .filter((c) => c.group !== 'elective')
        .reduce((a, c) => a + c.credits, 0),
      members
        .filter((c) => c.group === 'elective')
        .reduce((a, c) => a + c.credits, 0),
    ],
    expected,
    category,
  );
}
for (const c of courses) {
  assert(c.name.en && c.name.fa && c.description.en && c.description.fa, c.id);
  assert(Number.isInteger(c.credits) && c.credits > 0, c.id);
  for (const id of [...c.prerequisiteIds, ...c.corequisiteIds])
    assert(ids.has(id), `${c.id} dependency ${id}`);
  assert(c.sources.length, c.id);
  for (const p of c.pathwayIds)
    assert(pathways.find((x) => x.id === p)?.courseIds.includes(c.id));
  assert(c.wikipedia.en, `Missing English article: ${c.id}`);
  for (const locale of ['en', 'fa'])
    if (c.wikipedia[locale])
      assert(
        new URL(c.wikipedia[locale].url).hostname === `${locale}.wikipedia.org`,
      );
}
assert.equal(pathways.filter((p) => !p.supporting).length, 7);
assert.equal(
  pathways
    .find((p) => p.id === 'healthcare')
    .courseIds.filter(
      (id) => courses.find((c) => c.id === id).group === 'supplementary',
    ).length,
  3,
);
assert.equal(new Set(tools.map((t) => t.id)).size, tools.length);
for (const t of tools) {
  assert(t.name && t.description.en && t.description.fa && t.courseIds.length);
  assert(new URL(t.url).protocol === 'https:');
  for (const id of t.courseIds) assert(ids.has(id));
}
const careerIds = new Set(careerData.careers.map((career) => career.id));
assert.equal(careerData.tracks.length, 2, 'Career track count');
assert.equal(careerData.domains.length, 10, 'Career domain count');
assert.equal(careerData.careers.length, 30, 'Career profile count');
assert.equal(
  careerData.careers.filter((career) => career.supplemental).length,
  0,
  'Obsolete supplemental careers remain',
);
assert.equal(careerIds.size, careerData.careers.length, 'Duplicate career IDs');
assert.deepEqual(
  careerData.tracks.map((track) => [track.id, ...track.domainIds]),
  [
    [
      'traditional',
      'analytics',
      'project',
      'quality-safety',
      'logistics-supply-chain',
      'production',
      'modeling-optimization',
      'management',
    ],
    ['modern', 'data', 'product', 'business'],
  ],
  'Career track hierarchy',
);
const treeCareerIds = careerData.domains.flatMap((domain) => domain.careerIds);
assert.equal(
  new Set(treeCareerIds).size,
  30,
  'Career tree membership',
);
for (const id of treeCareerIds) {
  const career = careerData.careers.find((item) => item.id === id);
  assert(career && !career.supplemental, `Invalid tree career ${id}`);
}
const domainIds = new Set(careerData.domains.map((domain) => domain.id));
for (const track of careerData.tracks) {
  assert(track.name.en && track.name.fa, `${track.id} name`);
  for (const id of track.domainIds) assert(domainIds.has(id), `${id} domain`);
}
for (const domain of careerData.domains) {
  assert(
    domain.name.en && domain.name.fa && domain.careerIds.length,
    domain.id,
  );
  assert.equal(
    careerData.tracks.find((track) => track.id === domain.trackId)?.domainIds.includes(
      domain.id,
    ),
    true,
    `${domain.id} track`,
  );
  for (const id of domain.careerIds)
    assert.equal(
      careerData.careers.find((career) => career.id === id)?.domainId,
      domain.id,
      `${id} domain`,
    );
}
for (const career of careerData.careers) {
  for (const field of ['name', 'summary', 'iseFit', 'dayInLife'])
    assert(career[field].en && career[field].fa, `${career.id} ${field}`);
  for (const field of [
    'responsibilities',
    'skills',
    'entrySteps',
    'progression',
    'relatedRoles',
  ])
    assert(
      career[field].en.length >= 3 && career[field].fa.length >= 3,
      `${career.id} ${field}`,
    );
  assert(career.tools.length >= 3, `${career.id} tools`);
}
const careerSources = careerData.careers.filter((career) => career.source);
assert.equal(careerSources.length, 18, 'JobVision source count');
for (const career of careerSources) {
  const source = new URL(career.source.url);
  assert.equal(source.protocol, 'https:', `${career.id} source protocol`);
  assert.equal(source.hostname, 'jobvision.ir', `${career.id} source hostname`);
  assert(
    career.source.label.en && career.source.label.fa,
    `${career.id} source label`,
  );
}
const categoryConfig = readFileSync(
  new URL('../lib/domain-config.ts', import.meta.url),
  'utf8',
);
assert(
  !categoryConfig.includes('character:'),
  'Character labels remain in category data',
);
for (const mapping of [
  "asset: '/Mahito.svg'",
  "asset: '/Dagon.svg'",
  "audio: '/audio/gojo-domain-expansion.m4a'",
  "audio: '/audio/sukuna-domain-expansion.m4a'",
  "audio: '/audio/mahito-domain-expansion.m4a'",
  "audio: '/audio/dagon-domain-expansion.m4a'",
]) {
  assert(categoryConfig.includes(mapping), `Missing domain media ${mapping}`);
}
assert(
  !categoryConfig.includes('/Megumi-Fushiguro.svg') &&
    !categoryConfig.includes('/Toji-Fushiguro.svg'),
  'Replaced domain artwork remains configured',
);
for (const asset of [
  'Kento-Nanami.svg',
  'Mei-Mei.svg',
  'Satoru-Gojo-ISE.svg',
  'Ryomen-Sukuna.svg',
  'Dagon.svg',
  'Mahito.svg',
  'Sukuna-Domain-Expansion.svg',
  'audio/dagon-domain-expansion.m4a',
  'audio/gojo-domain-expansion.m4a',
  'audio/mahito-domain-expansion.m4a',
  'audio/sukuna-domain-expansion.m4a',
  'curriculum-1403.pdf',
])
  assert(existsSync(new URL(`../public/${asset}`, import.meta.url)), asset);
console.log(
  `Validated ${courses.length} courses, degree and subject totals, ${pathways.length} pathway groups, ${tools.length} tools, ${careerData.careers.length} bilingual career profiles, relationships and destinations.`,
);
