import React from 'react';
import { cn } from '@/utils/cn';

interface ThematicHeroProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageAlt: string;
  className?: string;
  variant?: 'split' | 'overlay';
  children?: React.ReactNode;
}

export const ThematicHero = ({
  title,
  subtitle,
  imageUrl,
  imageAlt,
  className,
  variant = 'split',
  children
}: ThematicHeroProps) => {
  if (variant === 'split') {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100", className)}>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
          {children}
        </div>
        <div className="hidden md:block">
          <img src={imageUrl} alt={imageAlt} className="w-full h-auto rounded-lg shadow-md" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative p-8 rounded-xl overflow-hidden shadow-sm", className)}>
      <img src={imageUrl} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-primary-900/60" />
      <div className="relative z-10 space-y-2 text-white">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-primary-100">{subtitle}</p>}
      </div>
    </div>
  );
};
