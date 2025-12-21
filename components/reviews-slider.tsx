'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Review {
  id: string;
  customerName?: string;
  rating?: number;
  reviewFr: string;
  reviewAr: string;
}

interface ReviewsSliderProps {
  reviews: Review[];
  autoPlayInterval?: number;
}

export function ReviewsSlider({ reviews, autoPlayInterval = 6000 }: ReviewsSliderProps) {
  const { locale, t } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [reviews.length, autoPlayInterval]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (reviews.length === 0) {
    return null;
  }

  const review = reviews[currentReview];
  const reviewText = locale === 'ar' ? review.reviewAr : review.reviewFr;

  return (
    <section className="py-16" style={{ backgroundColor: '#F1E5B4' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#383738' }}>
          {t.reviews.title}
        </h2>

        <div className="relative max-w-4xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                {/* Rating */}
                {review.rating && (
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${index < review.rating!
                            ? 'fill-[var(--brand-pink)] text-[var(--brand-pink)]'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                )}

                {/* Review Text */}
                <p className="text-lg mb-6 italic" style={{ color: '#383738' }}>
                  "{reviewText}"
                </p>

                {/* Customer Name */}
                <p className="font-semibold" style={{ color: '#383738' }}>
                  {review.customerName || t.reviews.anonymous}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={prevReview}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-6 w-6" style={{ color: '#383738' }} />
              </button>
              <button
                onClick={nextReview}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg"
                aria-label="Next review"
              >
                <ChevronRight className="h-6 w-6" style={{ color: '#383738' }} />
              </button>
            </>
          )}

          {/* Indicators */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`h-2 w-2 rounded-full transition-all ${index === currentReview
                      ? 'bg-[var(--brand-pink)] w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
