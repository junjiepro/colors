'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MainNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'MCP Tools', href: '/tools' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
