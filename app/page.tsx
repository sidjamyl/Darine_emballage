'use client';

import { useLanguage } from '@/lib/language-context';
import { HeroSlider } from '@/components/hero-slider';
import { ProductCard } from '@/components/product-card';
import { ReviewsSlider } from '@/components/reviews-slider';
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
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch popular products
    fetch('/api/products?popular=true')
      .then((res) => res.json())
      .then((data) => setPopularProducts(data))
      .catch(() => setPopularProducts([]));

    // Fetch reviews
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => setReviews([]));
  }, []);

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider slides={HERO_SLIDES} />

      {/* Popular Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#383738' }}>
          {t.products.popular}
        </h2>
        {popularProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product: any) => (
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