'use client';

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t mt-16" style={{ backgroundColor: '#F1E5B4' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#383738' }}>
              Darine Emballage
            </h3>
            <p className="text-sm" style={{ color: '#383738' }} suppressHydrationWarning>
              {t.about.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#383738' }} suppressHydrationWarning>
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#F8A6B0] transition-colors" suppressHydrationWarning>
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-[#F8A6B0] transition-colors" suppressHydrationWarning>
                  {t.nav.catalog}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F8A6B0] transition-colors" suppressHydrationWarning>
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F8A6B0] transition-colors" suppressHydrationWarning>
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#383738' }} suppressHydrationWarning>
              {t.nav.contact}
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: '#383738' }}>
              <li suppressHydrationWarning>{t.contact.phone}: +213 540153721</li>
              <li suppressHydrationWarning>{t.contact.address}: El-Biar Alger, Algérie</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-4 text-center text-sm" style={{ color: '#383738' }}>
          <p suppressHydrationWarning>© {new Date().getFullYear()} Darine Emballage. {t.footer.rights}.</p>
        </div>
      </div>
    </footer>
  );
}
