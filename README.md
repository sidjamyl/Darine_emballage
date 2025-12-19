# Darine Emballage - Site E-commerce

Site e-commerce complet bilingue (FR/AR) pour Darine Emballage, spécialisé dans les produits d'emballage et alimentaires.

## 🚀 Technologies

- **Next.js 16** - Framework React
- **TypeScript** - Langage typé
- **Prisma 5.22** - ORM pour la base de données
- **Better Auth** - Authentification sécurisée
- **shadcn/ui** - Composants UI
- **Tailwind CSS** - Styles
- **SQLite** - Base de données (dev)

## 🎨 Palette de Couleurs

- Rose: `#F8A6B0`
- Jaune: `#F1E5B4`
- Noir (texte): `#383738`

## 📁 Structure du Site

### Pages Publiques

- **/** - Page d'accueil avec hero slider, produits populaires et avis clients
- **/catalog** - Catalogue complet avec recherche et filtres
- **/about** - Page à propos
- **/contact** - Formulaire de contact
- **/cart** - Panier avec calcul des frais de livraison

### Pages Admin

- **/admin** - Panel d'administration (authentification requise)

## 🌍 Internationalisation

Le site est entièrement bilingue avec support RTL pour l'arabe.

## 🛠️ Installation

First, install dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
