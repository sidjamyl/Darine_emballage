/**
 * Product Filters Component
 * 
 * Search and filter controls for product catalog.
 */

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: 'ALL' | 'FOOD' | 'PACKAGING';
  setSelectedType: (type: 'ALL' | 'FOOD' | 'PACKAGING') => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  onReset: () => void;
  t: any;
}

export function ProductFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onReset,
  t
}: ProductFiltersProps) {
  return (
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
        onClick={onReset}
        className="mt-4"
      >
        {t.common.cancel}
      </Button>
    </div>
  );
}
