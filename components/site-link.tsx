import type { ComponentProps } from 'react';
import { withBasePath } from '@/lib/base-path';

// Use document navigation: vinext's production RSC link runtime currently fails
// during prefetch and click. URL-based filters and preferences survive navigation.
export default function SiteLink({ children, ...props }: ComponentProps<'a'>) {
  const href =
    typeof props.href === 'string' ? withBasePath(props.href) : props.href;
  return (
    <a {...props} href={href}>
      {children}
    </a>
  );
}
