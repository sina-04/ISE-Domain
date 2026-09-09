import {
  access,
  copyFile,
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { join, parse } from 'node:path';

const outputDirectory = join(process.cwd(), 'dist', 'client');
const pagesBasePath = '/ISE-Domain/';
const prefixedAssetsDirectory = join(outputDirectory, 'ISE-Domain');
const nestedNextDirectory = join(prefixedAssetsDirectory, '_next');
const publicNextDirectory = join(outputDirectory, '_next');

// assetPrefix gives HTML the correct public URL, but vinext also nests the
// generated directory under that prefix. A Pages project already supplies the
// repository prefix, so its artifact must expose `_next` at the artifact root.
await access(nestedNextDirectory);
await rm(publicNextDirectory, { recursive: true, force: true });
await rename(nestedNextDirectory, publicNextDirectory);
await rm(prefixedAssetsDirectory, { recursive: true, force: true });

// GitHub Pages otherwise filters vinext's `_next` directory during publication.
await writeFile(join(outputDirectory, '.nojekyll'), '');

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectHtmlFiles(path)));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

for (const source of await collectHtmlFiles(outputDirectory)) {
  const parsed = parse(source);
  if (parsed.name === 'index' || parsed.name === '404') continue;
  const destinationDirectory = join(parsed.dir, parsed.name);
  await mkdir(destinationDirectory, { recursive: true });
  await copyFile(source, join(destinationDirectory, 'index.html'));
}

// Refuse to publish an artifact whose HTML points at missing static files. A
// missing `_next` stylesheet is rendered by browsers as an unstyled HTML page,
// even though the Pages deployment itself reports success.
const missingReferences = new Set();
let stylesheetCount = 0;
let scriptCount = 0;

for (const htmlFile of await collectHtmlFiles(outputDirectory)) {
  const html = await readFile(htmlFile, 'utf8');
  const references = html.matchAll(/\b(?:href|src)="(\/ISE-Domain\/[^"?#]+)(?:[?#][^"]*)?"/g);

  for (const match of references) {
    const publicPath = decodeURIComponent(match[1]);
    const artifactPath = join(outputDirectory, publicPath.slice(pagesBasePath.length));

    if (publicPath.includes('/_next/') && publicPath.endsWith('.css')) stylesheetCount += 1;
    if (publicPath.includes('/_next/') && publicPath.endsWith('.js')) scriptCount += 1;

    try {
      await access(artifactPath);
    } catch {
      missingReferences.add(publicPath);
    }
  }
}

if (stylesheetCount === 0 || scriptCount === 0) {
  throw new Error('GitHub Pages output does not reference its compiled CSS and JavaScript.');
}

if (missingReferences.size > 0) {
  throw new Error(
    `GitHub Pages output references missing files:\n${[...missingReferences].sort().join('\n')}`,
  );
}

console.log(
  `GitHub Pages artifact ready: ${stylesheetCount} stylesheet and ${scriptCount} script references verified.`,
);
