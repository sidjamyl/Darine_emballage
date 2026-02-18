'use client';

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import { Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import { TikTokIcon } from './tiktok-icon';

const stores = [
  {
    nameFr: 'El Biar',
    nameAr: 'الأبيار',
    phone: '0540153721',
    addressFr: 'El Biar, Alger',
    addressAr: 'الأبيار، الجزائر',
    descFr: 'Pâtissier et emballage gros et détail',
    descAr: 'حلويات وتغليف بالجملة والتجزئة',
    instagram: 'https://www.instagram.com/darine_emballage_el_biar/',
    facebook: 'https://www.facebook.com/p/Darine-emballage-el-biar-100091588476165/',
    tiktok: 'https://www.tiktok.com/@darine.emballage_el_biar',
  },
  {
    nameFr: 'Sebala',
    nameAr: 'السبالة',
    phone: '0554289571',
    addressFr: 'Sebala, Alger',
    addressAr: 'السبالة، الجزائر',
    descFr: 'Produits pâtissiers et emballage',
    descAr: 'منتجات الحلويات والتغليف',
    instagram: 'https://www.instagram.com/darine_emballage_sebala_/',
    facebook: 'https://www.facebook.com/p/Darine-emballage-sebala-61565960947169/',
    tiktok: 'https://www.tiktok.com/@darine_emballage_sebala',
  },
];

export function Footer() {
  const { t, locale } = useLanguage();

  return (
    <footer className="border-t mt-16" style={{ backgroundColor: '#F1E5B4' }}>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#383738' }}>
              Darine Emballage
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#383738' }}>
              {t.about.description}
            </p>

            {/* Quick Links */}
            <h4 className="font-semibold mt-6 mb-3" style={{ color: '#383738' }}>
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-1.5 text-sm">
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

          {/* Store Cards */}
          {stores.map((store) => (
            <div key={store.nameFr}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--brand-pink)' }}
                >
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-bold text-base" style={{ color: '#383738' }}>
                  {locale === 'ar' ? store.nameAr : store.nameFr}
                </h4>
              </div>

              <p className="text-xs text-gray-600 mb-3">
                {locale === 'ar' ? store.descAr : store.descFr}
              </p>

              <ul className="space-y-2 text-sm" style={{ color: '#383738' }}>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                  <a
                    href={`tel:${store.phone}`}
                    className="hover:text-[var(--brand-pink)] transition-colors"
                  >
                    {store.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                  <span>{locale === 'ar' ? store.addressAr : store.addressFr}</span>
                </li>
              </ul>

              {/* Social links per store */}
              <div className="flex items-center gap-2 mt-3">
                <a
                  href={store.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/50 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300 hover:shadow-sm cursor-pointer"
                  title={`Instagram - ${store.nameFr}`}
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={store.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/50 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300 hover:shadow-sm cursor-pointer"
                  title={`Facebook - ${store.nameFr}`}
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={store.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/50 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300 hover:shadow-sm cursor-pointer"
                  title={`TikTok - ${store.nameFr}`}
                >
                  <TikTokIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}

          {/* Delivery info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500"
              >
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
                  <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
                  <circle cx="7" cy="18" r="2" />
                  <circle cx="17" cy="18" r="2" />
                </svg>
              </div>
              <h4 className="font-bold text-base" style={{ color: '#383738' }}>
                {locale === 'ar' ? 'التوصيل' : 'Livraison'}
              </h4>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#383738' }}>
              {locale === 'ar'
                ? 'توصيل متاح إلى جميع ولايات الوطن'
                : 'Livraison disponible vers toutes les wilayas du pays'}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {locale === 'ar' ? 'متاح الآن' : 'Disponible maintenant'}
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-4 text-center text-sm" style={{ color: '#383738' }}>
          <p>&copy; {new Date().getFullYear()} Darine Emballage. {t.footer.rights}.</p>
        </div>
      </div>
    </footer>
  );
}
