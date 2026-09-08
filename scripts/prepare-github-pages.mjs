import {
  copyFile,
  mkdir,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { join, parse } from 'node:path';

const outputDirectory = join(process.cwd(), 'dist', 'client');
const prefixedAssetsDirectory = join(outputDirectory, 'ISE-Domain');
const nestedNextDirectory = join(prefixedAssetsDirectory, '_next');
const publicNextDirectory = join(outputDirectory, '_next');

// assetPrefix gives HTML the correct public URL, but vinext also nests the
// generated directory under that prefix. A Pages project already supplies the
// repository prefix, so its artifact must expose `_next` at the artifact root.
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
