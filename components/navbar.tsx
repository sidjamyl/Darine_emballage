'use client';

import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function Navbar() {
  const { t } = useLanguage();
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="border-b" style={{ backgroundColor: 'white' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold" style={{ color: '#383738' }}>
            Darine Emballage
          </Link>

          {/* Navigation Links */}
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

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex flex-col gap-2">
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
          <Link href="/cart" className="relative hover:text-[#F8A6B0] transition-colors inline-flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t.nav.cart}
            {itemCount > 0 && (
              <span className="bg-[#F8A6B0] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
