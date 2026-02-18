export type Locale = 'fr' | 'ar';

export const locales: Locale[] = ['fr', 'ar'];
export const defaultLocale: Locale = 'ar';

export const translations = {
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      catalog: 'Catalogue',
      about: 'À propos',
      cart: 'Panier',
      contact: 'Contact',
      admin: 'Administration',
      myOrders: 'Mes Commandes',
    },
    // Hero Section
    hero: {
      title: 'Darine Emballage',
      subtitle: 'Qualité, emballages, produits alimentaires & livraison',
      viewCatalog: 'Voir le catalogue',
    },
    // Products
    products: {
      popular: 'Produits les plus populaires',
      addToCart: 'Ajouter au panier',
      orderNow: 'Commander maintenant',
      food: 'Produit alimentaire',
      packaging: 'Produit d\'emballage',
      allProducts: 'Tous les produits',
      searchPlaceholder: 'Rechercher un produit...',
      filterByType: 'Filtrer par type',
      filterByPrice: 'Filtrer par prix',
      minPrice: 'Prix minimum',
      maxPrice: 'Prix maximum',
      noProducts: 'Aucun produit trouvé',
      selectVariant: 'Sélectionner une option',
      quantity: 'Quantité',
      price: 'Prix',
      new: 'Nouveau !',
    },
    // Cart
    cart: {
      title: 'Mon Panier',
      empty: 'Votre panier est vide',
      subtotal: 'Sous-total',
      shipping: 'Frais de livraison',
      total: 'Total',
      remove: 'Retirer',
      checkout: 'Finaliser la commande',
      continueToPayment: 'Continuer',
      fillInfo: 'Veuillez remplir vos informations avant de finaliser la commande.',
      continueShopping: 'Continuer mes achats',
      yourCart: 'Votre panier',
      items: 'article(s)',
      orderSuccess: 'Votre commande a été envoyée avec succès! Nous vous contacterons bientôt',
    },
    // Customer Info
    customer: {
      title: 'Informations de livraison',
      fullName: 'Nom complet',
      phone: 'Numéro de téléphone',
      email: 'Email',
      address: 'Adresse complète',
      wilaya: 'Wilaya',
      selectWilaya: 'Sélectionner une wilaya',
      municipality: 'Commune',
      selectMunicipality: 'Sélectionner une commune',
      deliveryType: 'Type de livraison',
      home: 'Livraison à domicile',
      stopdesk: 'Bureau',
    },
    // Reviews
    reviews: {
      title: 'Avis de nos clients',
      anonymous: 'Client anonyme',
    },
    // Contact
    contact: {
      title: 'Contactez-nous',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      message: 'Message',
      send: 'Envoyer',
      whatsapp: 'WhatsApp',
      address: 'Adresse',
      success: 'Message envoyé avec succès !',
    },
    // About
    about: {
      title: 'À propos de Darine Emballage',
      description: 'Darine Emballage est votre partenaire de confiance pour tous vos besoins en emballage et produits alimentaires de qualité.',
    },
    // Footer
    footer: {
      quickLinks: 'Liens rapides',
      legal: 'Mentions légales',
      rights: 'Tous droits réservés',
    },
    // Admin
    admin: {
      title: 'Administration',
      orders: 'Commandes',
      orderDetails: 'Détails de la commande',
      confirm: 'Confirmer',
      cancel: 'Annuler',
      confirmOrder: 'Confirmer cette commande ?',
      cancelOrder: 'Annuler cette commande ?',
      confirmMessage: 'Cette action enverra la commande à Elogistia.',
      cancelMessage: 'Cette action annulera définitivement la commande.',
      yes: 'Oui',
      no: 'Non',
      status: {
        DRAFT: 'Brouillon',
        CONFIRMED: 'Confirmée',
        CANCELLED: 'Annulée',
        DELIVERED: 'Livrée',
      },
    },
    // Common
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Enregistrer',
      edit: 'Modifier',
      delete: 'Supprimer',
      close: 'Fermer',
    },
  },
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      catalog: 'القائمة الرئيسية',
      about: 'من نحن',
      cart: 'السلة',
      contact: 'اتصل بنا',
      admin: 'الإدارة',
      myOrders: 'طلباتي',
    },
    // Hero Section
    hero: {
      title: 'دارين للتغليف',
      subtitle: 'جودة، تغليف، منتجات غذائية وتوصيل',
      viewCatalog: 'عرض القائمة الرئيسية',
    },
    // Products
    products: {
      popular: 'المنتجات الأكثر شعبية',
      addToCart: 'أضف إلى السلة',
      orderNow: 'اطلب الآن',
      food: 'منتج غذائي',
      packaging: 'منتج تغليف',
      allProducts: 'جميع المنتجات',
      searchPlaceholder: 'ابحث عن منتج...',
      filterByType: 'تصفية حسب النوع',
      filterByPrice: 'تصفية حسب السعر',
      minPrice: 'السعر الأدنى',
      maxPrice: 'السعر الأقصى',
      noProducts: 'لم يتم العثور على منتجات',
      selectVariant: 'اختر خيارًا',
      quantity: 'الكمية',
      price: 'السعر',
      new: 'جديد !',
    },
    // Cart
    cart: {
      title: 'سلتي',
      empty: 'سلتك فارغة',
      subtotal: 'المجموع الفرعي',
      shipping: 'سعر التوصيل',
      total: 'المجموع ',
      remove: 'إزالة',
      checkout: 'إتمام الطلب',
      continueToPayment: 'متابعة',
      fillInfo: 'يرجى ملء معلوماتك قبل إتمام الطلب.',
      continueShopping: 'متابعة التسوق',
      yourCart: 'سلة التسوق',
      items: 'منتج(ات)',
      orderSuccess: 'تم إرسال طلبك بنجاح! سنتصل بك قريباً',
    },
    // Customer Info
    customer: {
      title: 'معلومات التوصيل',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      address: 'العنوان الكامل',
      wilaya: 'الولاية',
      selectWilaya: 'اختر الولاية',
      municipality: 'البلدية',
      selectMunicipality: 'اختر البلدية',
      deliveryType: 'نوع التوصيل',
      home: 'التوصيل للمنزل',
      stopdesk: 'مكتب',
    },
    // Reviews
    reviews: {
      title: 'آراء عملائنا',
      anonymous: 'عميل مجهول',
    },
    // Contact
    contact: {
      title: 'اتصل بنا',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      message: 'الرسالة',
      send: 'إرسال',
      whatsapp: 'واتساب',
      address: 'العنوان',
      success: 'تم إرسال الرسالة بنجاح!',
    },
    // About
    about: {
      title: 'عن دارين للتغليف',
      description: 'دارين للتغليف هو شريكك الموثوق لجميع احتياجاتك من التغليف والمنتجات الغذائية عالية الجودة.',
    },
    // Footer
    footer: {
      quickLinks: 'روابط سريعة',
      legal: 'الشروط القانونية',
      rights: 'جميع الحقوق محفوظة',
    },
    // Admin
    admin: {
      title: 'الإدارة',
      orders: 'الطلبات',
      orderDetails: 'تفاصيل الطلب',
      confirm: 'تأكيد',
      cancel: 'إلغاء',
      confirmOrder: 'تأكيد هذا الطلب؟',
      cancelOrder: 'إلغاء هذا الطلب؟',
      confirmMessage: 'سيتم إرسال الطلب إلى Elogistia.',
      cancelMessage: 'سيتم إلغاء الطلب نهائيًا.',
      yes: 'نعم',
      no: 'لا',
      status: {
        DRAFT: 'مسودة',
        CONFIRMED: 'مؤكد',
        CANCELLED: 'ملغى',
        DELIVERED: 'تم التوصيل',
      },
    },
    // Common
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      success: 'نجح',
      cancel: 'إلغاء',
      save: 'حفظ',
      edit: 'تعديل',
      delete: 'حذف',
      close: 'إغلاق',
    },
  },
};

export function getTranslation(locale: Locale = defaultLocale) {
  return translations[locale];
}
