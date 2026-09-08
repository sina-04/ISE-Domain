import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const pagesBasePath = '/ISE-Domain';

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: 'export',
      assetPrefix: pagesBasePath,
      env: { NEXT_PUBLIC_BASE_PATH: pagesBasePath },
    }
  : { env: { NEXT_PUBLIC_BASE_PATH: '' } };

export default nextConfig;
