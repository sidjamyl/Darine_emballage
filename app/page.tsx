'use client';

import { useLanguage } from '@/lib/language-context';
import { HeroSlider } from '@/components/hero-slider';
import { ProductCard } from '@/components/product-card';
import { ReviewsSlider } from '@/components/reviews-slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

// Configuration des slides hero (images statiques)
// Pour ajouter une nouvelle image, ajoutez-la dans le dossier public/ et ajoutez une entrée ici
const HERO_SLIDES = [
  {
    id: '1',
    image: '/hero1.jpg',
    titleFr: 'Bienvenue chez Darine Emballage',
    titleAr: 'مرحبا بكم في دارين للتغليف',
    subtitleFr: ' Vente d\'emballage et produits alimentaires',
    subtitleAr: 'بيع التغليف والمنتجات الغذائية الخاصة بك',
  },
  {
    id: '2',
    image: '/hero2.jpg',
    titleFr: 'Qualité et Innovation',
    titleAr: 'الجودة والابتكار',
    subtitleFr: 'Des produits de qualité ',
    subtitleAr: 'منتجات عالية الجودة ',
  },
  // Ajoutez ici d'autres slides si nécessaire :
  // {
  //   id: '3',
  //   image: '/hero3.jpg',
  //   titleFr: 'Votre titre',
  //   titleAr: 'العنوان الخاص بك',
  //   subtitleFr: 'Votre sous-titre',
  //   subtitleAr: 'العنوان الفرعي الخاص بك',
  // },
];

export default function Home() {
  const { t } = useLanguage();
  const [popularProducts, setPopularProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'FOOD' | 'PACKAGING'>('ALL');

  useEffect(() => {
    // Fetch popular products
    fetch('/api/products?popular=true')
      .then((res) => res.json())
      .then((data) => {
        setPopularProducts(data);
        setFilteredProducts(data);
      })
      .catch(() => {
        setPopularProducts([]);
        setFilteredProducts([]);
      });

    // Fetch reviews
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => setReviews([]));
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...popularProducts];

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
  }, [popularProducts, searchQuery, selectedType]);

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider slides={HERO_SLIDES} />

      {/* Popular Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#383738' }}>
          {t.products.popular}
        </h2>

        {/* Filters */}
        <div className="mb-8 space-y-4 max-w-4xl mx-auto">
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
          <div className="flex flex-wrap gap-3 justify-center">
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

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">{t.products.noProducts}</p>
        )}
      </section>

      {/* Reviews Slider */}
      {reviews.length > 0 && <ReviewsSlider reviews={reviews} />}
    </>
  );
}