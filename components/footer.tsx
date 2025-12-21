'use client';

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { TikTokIcon } from './tiktok-icon';

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
            <p className="text-sm" style={{ color: '#383738' }}>
              {t.about.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#383738' }}>
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[var(--brand-pink)] transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-[var(--brand-pink)] transition-colors">
                  {t.nav.catalog}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--brand-pink)] transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--brand-pink)] transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#383738' }}>
              {t.nav.contact}
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: '#383738' }}>
              <li>{t.contact.phone}: +213 540153721</li>
              <li>{t.contact.address}: El-Biar Alger, Algérie</li>
            </ul>

            <div className="flex items-center gap-3 mt-4">
              <a href="https://www.instagram.com/darine_emballage_el_biar/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/50 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300 hover:shadow-sm">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://web.facebook.com/p/Darine-emballage-el-biar-100091588476165/?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/50 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300 hover:shadow-sm">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@darine.emballage_el_biar" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/50 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300 hover:shadow-sm">
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-4 text-center text-sm" style={{ color: '#383738' }}>
          <p>© {new Date().getFullYear()} Darine Emballage. {t.footer.rights}.</p>
        </div>
      </div>
    </footer>
  );
}
