import { BookOpenCheck } from 'lucide-react';
import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <BookOpenCheck className="h-8 w-8 text-primary" {...props} />
  );
}
