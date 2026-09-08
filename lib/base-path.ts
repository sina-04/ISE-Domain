const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBasePath(path: string) {
  if (!configuredBasePath || !path.startsWith('/') || path.startsWith('//')) {
    return path;
  }
  if (path === configuredBasePath || path.startsWith(`${configuredBasePath}/`)) {
    return path;
  }
  return `${configuredBasePath}${path}`;
}
