'use client';

import { useLanguage } from '@/lib/language-context';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={locale === 'fr' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLocale('fr')}
      >
        FR
      </Button>
      <Button
        variant={locale === 'ar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLocale('ar')}
      >
        AR
      </Button>
    </div>
  );
}
