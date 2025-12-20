'use client';

import { useLanguage } from '@/lib/language-context';

export default function AboutPage() {
  const { t, locale } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#383738' }}>
          {t.about.title}
        </h1>

        <div className="prose max-w-none">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <p className="text-lg mb-6" style={{ color: '#383738' }}>
              {t.about.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#F8A6B0' }}>
                  {locale === 'ar' ? 'مهمتنا' : 'Notre Mission'}
                </h2>
                <p style={{ color: '#383738' }}>
                  {locale === 'ar' 
                    ? 'نسعى لتقديم أفضل منتجات التغليف والمواد الغذائية بجودة عالية وأسعار تنافسية، مع خدمة توصيل سريعة وموثوقة في جميع أنحاء الجزائر.'
                    : 'Nous nous efforçons de fournir les meilleurs produits d\'emballage et alimentaires de haute qualité à des prix compétitifs, avec un service de livraison rapide et fiable dans toute l\'Algérie.'}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#F8A6B0' }}>
                  {locale === 'ar' ? 'قيمنا' : 'Nos Valeurs'}
                </h2>
                <ul className="space-y-2" style={{ color: '#383738' }}>
                  <li>✓ {locale === 'ar' ? 'الجودة أولاً' : 'Qualité avant tout'}</li>
                  <li>✓ {locale === 'ar' ? 'خدمة عملاء ممتازة' : 'Service client excellent'}</li>
                  <li>✓ {locale === 'ar' ? 'توصيل سريع وآمن' : 'Livraison rapide et sûre'}</li>
                  <li>✓ {locale === 'ar' ? 'أسعار تنافسية' : 'Prix compétitifs'}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#F8A6B0' }}>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white">{locale === 'ar' ? 'منتج' : 'Produits'}</div>
            </div>
           
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#F8A6B0' }}>
              <div className="text-4xl font-bold text-white mb-2">58</div>
              <div className="text-white">{locale === 'ar' ? 'ولاية مُغطاة' : 'Wilayas couvertes'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
