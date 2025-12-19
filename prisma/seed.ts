import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed Hero Slides
  await prisma.heroSlide.createMany({
    data: [
      {
        image: '/images/hero-1.jpg',
        titleFr: 'Bienvenue chez Darine Emballage',
        titleAr: 'مرحبا بكم في دارين للتغليف',
        subtitleFr: 'Qualité et service au meilleur prix',
        subtitleAr: 'جودة وخدمة بأفضل الأسعار',
        order: 1,
        isActive: true,
      },
      {
        image: '/images/hero-2.jpg',
        titleFr: 'Produits alimentaires de qualité',
        titleAr: 'منتجات غذائية عالية الجودة',
        subtitleFr: 'Découvrez notre sélection',
        subtitleAr: 'اكتشف مجموعتنا',
        order: 2,
        isActive: true,
      },
      {
        image: '/images/hero-3.jpg',
        titleFr: 'Solutions d\'emballage complètes',
        titleAr: 'حلول تغليف كاملة',
        subtitleFr: 'Pour tous vos besoins',
        subtitleAr: 'لجميع احتياجاتك',
        order: 3,
        isActive: true,
      },
    ],
  });

  // Seed Products
  const product1 = await prisma.product.create({
    data: {
      nameFr: 'Sac en papier kraft',
      nameAr: 'كيس ورق كرافت',
      descriptionFr: 'Sac en papier kraft résistant, idéal pour vos courses',
      descriptionAr: 'كيس ورق كرافت قوي، مثالي لمشترياتك',
      price: 150.0,
      type: 'PACKAGING',
      image: '/images/products/kraft-bag.jpg',
      hasVariants: true,
      isPopular: true,
      variants: {
        create: [
          { nameFr: 'Petit', nameAr: 'صغير', priceAdjustment: 0 },
          { nameFr: 'Moyen', nameAr: 'متوسط', priceAdjustment: 50 },
          { nameFr: 'Grand', nameAr: 'كبير', priceAdjustment: 100 },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      nameFr: 'Huile d\'olive extra vierge',
      nameAr: 'زيت زيتون بكر ممتاز',
      descriptionFr: 'Huile d\'olive pure et naturelle, pressée à froid',
      descriptionAr: 'زيت زيتون نقي وطبيعي، معصور على البارد',
      price: 850.0,
      type: 'FOOD',
      image: '/images/products/olive-oil.jpg',
      hasVariants: false,
      isPopular: true,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      nameFr: 'Boîte alimentaire plastique',
      nameAr: 'علبة طعام بلاستيكية',
      descriptionFr: 'Boîte hermétique pour la conservation des aliments',
      descriptionAr: 'علبة محكمة الإغلاق لحفظ الطعام',
      price: 200.0,
      type: 'PACKAGING',
      image: '/images/products/food-box.jpg',
      hasVariants: true,
      isPopular: true,
      variants: {
        create: [
          { nameFr: '500ml', nameAr: '500 مل', priceAdjustment: 0 },
          { nameFr: '1L', nameAr: '1 لتر', priceAdjustment: 80 },
          { nameFr: '2L', nameAr: '2 لتر', priceAdjustment: 150 },
        ],
      },
    },
  });

  const product4 = await prisma.product.create({
    data: {
      nameFr: 'Miel naturel',
      nameAr: 'عسل طبيعي',
      descriptionFr: 'Miel pur et naturel, récolté localement',
      descriptionAr: 'عسل نقي وطبيعي، محلي الإنتاج',
      price: 1200.0,
      type: 'FOOD',
      image: '/images/products/honey.jpg',
      hasVariants: false,
      isPopular: true,
    },
  });

  // Seed Reviews
  await prisma.review.createMany({
    data: [
      {
        customerName: 'Ahmed Benali',
        rating: 5,
        reviewFr: 'Excellente qualité et livraison rapide. Je recommande vivement!',
        reviewAr: 'جودة ممتازة وتوصيل سريع. أنصح بشدة!',
        isVisible: true,
      },
      {
        customerName: 'Fatima Zahra',
        rating: 5,
        reviewFr: 'Produits de très bonne qualité, prix raisonnables. Service client au top!',
        reviewAr: 'منتجات ذات جودة عالية، أسعار معقولة. خدمة عملاء رائعة!',
        isVisible: true,
      },
      {
        customerName: 'Karim Mansouri',
        rating: 4,
        reviewFr: 'Très satisfait de mon achat. Emballage soigné.',
        reviewAr: 'راضٍ جدًا عن الشراء. تغليف محكم.',
        isVisible: true,
      },
      {
        rating: 5,
        reviewFr: 'Livraison dans les délais, produits conformes. Merci!',
        reviewAr: 'التوصيل في الوقت المحدد، منتجات مطابقة. شكرا!',
        isVisible: true,
      },
    ],
  });

  console.log('Seed completed successfully!');
  console.log({
    heroSlides: 3,
    products: 4,
    reviews: 4,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
