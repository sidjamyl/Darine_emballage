'use client';

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from './language-switcher';
import { ShoppingCart, Menu, X, Package, Instagram, Facebook } from 'lucide-react';
import { TikTokIcon } from './tiktok-icon';
import { useCart } from '@/lib/cart-context';
import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

export function Navbar() {
  const { t, locale } = useLanguage();
  const { items, openCart } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authClient.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  return (
    <nav className="border-b" style={{ backgroundColor: 'white' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Darine Emballage"
                width={120}
                height={60}
                className="h-12 md:h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Social Icons - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {/* El Biar */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-100" title="El Biar">
                <span className="text-[10px] font-semibold text-gray-500 tracking-wide">{locale === 'ar' ? 'الأبيار' : 'El Biar'}</span>
                <a href="https://www.instagram.com/darine_emballage_el_biar/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full text-gray-500 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300">
                  <Instagram className="h-3.5 w-3.5" />
                </a>
                <a href="https://www.facebook.com/p/Darine-emballage-el-biar-100091588476165/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full text-gray-500 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300">
                  <Facebook className="h-3.5 w-3.5" />
                </a>
                <a href="https://www.tiktok.com/@darine.emballage_el_biar" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full text-gray-500 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300">
                  <TikTokIcon className="h-3.5 w-3.5" />
                </a>
              </div>
              {/* Sebala */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-100" title="Sebala">
                <span className="text-[10px] font-semibold text-gray-500 tracking-wide">{locale === 'ar' ? 'السبالة' : 'Sebbala'}</span>
                <a href="https://www.instagram.com/darine_emballage_sebala_/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full text-gray-500 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300">
                  <Instagram className="h-3.5 w-3.5" />
                </a>
                <a href="https://www.facebook.com/p/Darine-emballage-sebala-61565960947169/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full text-gray-500 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300">
                  <Facebook className="h-3.5 w-3.5" />
                </a>
                <a href="https://www.tiktok.com/@darine_emballage_sebala" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full text-gray-500 hover:bg-[var(--brand-pink)] hover:text-white transition-all duration-300">
                  <TikTokIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-[var(--brand-pink)] transition-colors">
              {t.nav.home}
            </Link>
            <Link href="/catalog" className="hover:text-[var(--brand-pink)] transition-colors">
              {t.nav.catalog}
            </Link>
            <Link href="/about" className="hover:text-[var(--brand-pink)] transition-colors">
              {t.nav.about}
            </Link>
            <Link href="/contact" className="hover:text-[var(--brand-pink)] transition-colors">
              {t.nav.contact}
            </Link>
            {isAuthenticated && (
              <Link href="/mes-commandes" className="hover:text-[var(--brand-pink)] transition-colors flex items-center gap-1">
                <Package className="h-4 w-4" />
                {t.nav.myOrders || 'Mes Commandes'}
              </Link>
            )}
            <button onClick={openCart} className="relative hover:text-[var(--brand-pink)] transition-colors cursor-pointer">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--brand-pink)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button, Cart & Language */}
          <div className="flex md:hidden items-center gap-3">
            <LanguageSwitcher />
            <button onClick={openCart} className="relative hover:text-[var(--brand-pink)] transition-colors cursor-pointer">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--brand-pink)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" style={{ color: '#383738' }} />
              ) : (
                <Menu className="h-6 w-6" style={{ color: '#383738' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="hover:text-[var(--brand-pink)] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/catalog"
                className="hover:text-[var(--brand-pink)] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.catalog}
              </Link>
              <Link
                href="/about"
                className="hover:text-[var(--brand-pink)] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.about}
              </Link>
              <Link
                href="/contact"
                className="hover:text-[var(--brand-pink)] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.contact}
              </Link>
              {isAuthenticated && (
                <Link
                  href="/mes-commandes"
                  className="hover:text-[var(--brand-pink)] transition-colors py-2 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Package className="h-4 w-4" />
                  {t.nav.myOrders || 'Mes Commandes'}
                </Link>
              )}

              {/* Mobile Social Icons */}
              <div className="mt-4 pt-4 border-t space-y-3">
                {/* El Biar */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 text-center">{locale === 'ar' ? 'الأبيار' : 'El Biar'}</p>
                  <div className="flex items-center gap-4 justify-center">
                    <a href="https://www.instagram.com/darine_emballage_el_biar/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[var(--brand-pink)] hover:text-white transition-all">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="https://www.facebook.com/p/Darine-emballage-el-biar-100091588476165/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[var(--brand-pink)] hover:text-white transition-all">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="https://www.tiktok.com/@darine.emballage_el_biar" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[var(--brand-pink)] hover:text-white transition-all">
                      <TikTokIcon className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                {/* Sebala */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2 text-center">{locale === 'ar' ? 'السبالة' : 'Sebbala'}</p>
                  <div className="flex items-center gap-4 justify-center">
                    <a href="https://www.instagram.com/darine_emballage_sebala_/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[var(--brand-pink)] hover:text-white transition-all">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="https://www.facebook.com/p/Darine-emballage-sebala-61565960947169/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[var(--brand-pink)] hover:text-white transition-all">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="https://www.tiktok.com/@darine_emballage_sebala" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[var(--brand-pink)] hover:text-white transition-all">
                      <TikTokIcon className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
