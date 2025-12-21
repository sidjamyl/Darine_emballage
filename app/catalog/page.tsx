'use client';

import { useLanguage } from '@/lib/language-context';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function CatalogPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'FOOD' | 'PACKAGING'>('ALL');

  useEffect(() => {
    // Fetch all products
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(() => {
        setProducts([]);
        setFilteredProducts([]);
      });
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product: any) =>
        product.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.nameAr.includes(searchQuery) ||
        product.descriptionFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.descriptionAr.includes(searchQuery)
      );
    }

    // Type filter
    if (selectedType !== 'ALL') {
      filtered = filtered.filter((product: any) => product.type === selectedType);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedType]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8" style={{ color: '#383738' }}>
        {t.nav.catalog}
      </h1>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder={t.products.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedType === 'ALL' ? 'default' : 'outline'}
            onClick={() => setSelectedType('ALL')}
            style={selectedType === 'ALL' ? { backgroundColor: 'var(--brand-pink)', color: 'white' } : {}}
            className="hover:bg-[var(--brand-pink)] hover:text-white transition-colors"
          >
            {t.products.allProducts}
          </Button>
          <Button
            variant={selectedType === 'PACKAGING' ? 'default' : 'outline'}
            onClick={() => setSelectedType('PACKAGING')}
            style={selectedType === 'PACKAGING' ? { backgroundColor: 'var(--brand-pink)', color: 'white' } : {}}
            className="hover:bg-[var(--brand-pink)] hover:text-white transition-colors"
          >
            {t.products.packaging}
          </Button>
          <Button
            variant={selectedType === 'FOOD' ? 'default' : 'outline'}
            onClick={() => setSelectedType('FOOD')}
            style={selectedType === 'FOOD' ? { backgroundColor: 'var(--brand-pink)', color: 'white' } : {}}
            className="hover:bg-[var(--brand-pink)] hover:text-white transition-colors"
          >
            {t.products.food}
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">{t.products.noProducts}</p>
        </div>
      )}
    </div>
  );
}