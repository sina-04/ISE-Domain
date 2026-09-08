import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

const outputDirectory = join(process.cwd(), 'dist', 'client');

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
