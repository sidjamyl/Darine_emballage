'use client';

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from './language-switcher';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

export function Navbar() {
  const { t } = useLanguage();
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b" style={{ backgroundColor: 'white' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-[#F8A6B0] transition-colors">
              {t.nav.home}
            </Link>
            <Link href="/catalog" className="hover:text-[#F8A6B0] transition-colors">
              {t.nav.catalog}
            </Link>
            <Link href="/about" className="hover:text-[#F8A6B0] transition-colors">
              {t.nav.about}
            </Link>
            <Link href="/contact" className="hover:text-[#F8A6B0] transition-colors">
              {t.nav.contact}
            </Link>
            <Link href="/cart" className="relative hover:text-[#F8A6B0] transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F8A6B0] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button, Cart & Language */}
          <div className="flex md:hidden items-center gap-3">
            <LanguageSwitcher />
            <Link href="/cart" className="relative hover:text-[#F8A6B0] transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F8A6B0] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
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
                className="hover:text-[#F8A6B0] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link 
                href="/catalog" 
                className="hover:text-[#F8A6B0] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.catalog}
              </Link>
              <Link 
                href="/about" 
                className="hover:text-[#F8A6B0] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.about}
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-[#F8A6B0] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
