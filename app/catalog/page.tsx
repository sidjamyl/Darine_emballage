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
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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

    // Price filter
    if (minPrice) {
      filtered = filtered.filter((product: any) => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((product: any) => product.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedType, minPrice, maxPrice]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8" style={{ color: '#383738' }}>
        {t.nav.catalog}
      </h1>

      {/* Filters */}
      <div className="mb-8 p-6 rounded-lg border" style={{ backgroundColor: '#F1E5B4' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Label>{t.products.searchPlaceholder}</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder={t.products.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <Label>{t.products.filterByType}</Label>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder={t.products.filterByType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t.products.allProducts}</SelectItem>
                <SelectItem value="FOOD">{t.products.food}</SelectItem>
                <SelectItem value="PACKAGING">{t.products.packaging}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <Label>{t.products.filterByPrice}</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                placeholder={t.products.minPrice}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
              <Input
                type="number"
                placeholder={t.products.maxPrice}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={resetFilters}
          className="mt-4"
        >
          {t.common.cancel}
        </Button>
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
