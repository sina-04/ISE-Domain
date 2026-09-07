import type { ComponentProps } from 'react';

// Use document navigation: vinext's production RSC link runtime currently fails
// during prefetch and click. URL-based filters and preferences survive navigation.
export default function SiteLink({ children, ...props }: ComponentProps<'a'>) {
  return <a {...props}>{children}</a>;
}
