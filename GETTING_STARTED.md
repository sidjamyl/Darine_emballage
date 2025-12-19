# Guide de Démarrage - Darine Emballage

## ✅ Ce qui est fait

Le site e-commerce est maintenant opérationnel avec:

### Structure Complète
- ✅ Layout global avec Navbar et Footer bilingues
- ✅ Page d'accueil avec Hero Slider
- ✅ Page Catalogue avec recherche et filtres
- ✅ Page À propos
- ✅ Page Contact
- ✅ Page Panier avec intégration Elogistia
- ✅ Panel Admin sécurisé avec Better Auth

### Fonctionnalités
- ✅ Internationalisation FR/AR avec RTL
- ✅ Gestion du panier (localStorage + Context)
- ✅ Calcul automatique des frais de livraison
- ✅ Système de commandes en brouillon
- ✅ Intégration API Elogistia
- ✅ Base de données Prisma avec seed

### Composants UI
- ✅ Tous les composants shadcn nécessaires installés
- ✅ Design responsive
- ✅ Palette de couleurs Darine Emballage appliquée

## 🚀 Démarrage Rapide

```bash
# Le serveur de développement est déjà lancé
# Accessible sur: http://localhost:3000

# Pages disponibles:
http://localhost:3000/              # Accueil
http://localhost:3000/catalog       # Catalogue
http://localhost:3000/about         # À propos
http://localhost:3000/contact       # Contact
http://localhost:3000/cart          # Panier
http://localhost:3000/admin         # Admin (nécessite connexion)
http://localhost:3000/sign-in       # Connexion admin
```

## 📝 Prochaines Étapes Importantes

### 1. Ajouter des Images Réelles

Les produits utilisent actuellement des placeholders. Ajoutez vos images:

```
public/
  images/
    hero-1.jpg      # Image hero slider 1
    hero-2.jpg      # Image hero slider 2
    hero-3.jpg      # Image hero slider 3
    products/
      kraft-bag.jpg
      olive-oil.jpg
      food-box.jpg
      honey.jpg
```

### 2. Créer un Compte Admin

Pour accéder à `/admin`, vous devez créer un compte:

```bash
# Option 1: Via l'interface
# Allez sur http://localhost:3000/sign-in
# Puis créez un compte via le formulaire

# Option 2: Directement en base (avec Prisma Studio)
npx prisma studio
# Créez un utilisateur dans la table "user"
```

### 3. Configurer l'API Elogistia

Dans `lib/elogistia.ts`, ligne 50:
- L'endpoint `createOrder` est un placeholder
- Remplacez par l'URL exacte fournie par Elogistia
- Testez avec une vraie commande

### 4. Ajouter des Produits Réels

Via Prisma Studio ou en créant une interface admin:

```bash
npx prisma studio
```

Ajoutez vos produits dans la table `Product`:
- Nom (FR et AR)
- Description (FR et AR)
- Prix
- Type (FOOD ou PACKAGING)
- Image
- hasVariants (true/false)
- isPopular (pour la page d'accueil)

### 5. Configuration Email (Contact)

Le formulaire de contact enregistre actuellement les messages en console.
Pour envoyer des emails:

```bash
# Installer nodemailer
npm install nodemailer @types/nodemailer

# Configurer dans app/api/contact/route.ts
```

### 6. Variables d'Environnement

Créez un fichier `.env` (déjà créé):
```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Pour production
ELOGISTIA_API_KEY="votre-clé-api"
```

### 7. Logo

Ajoutez votre logo:
```
public/
  logo.png
```

Puis dans `components/navbar.tsx`:
```tsx
<Link href="/" className="flex items-center gap-2">
  <Image src="/logo.png" alt="Darine Emballage" width={40} height={40} />
  <span className="text-2xl font-bold">Darine Emballage</span>
</Link>
```

## 🔧 Commandes Utiles

```bash
# Démarrer le serveur
npm run dev

# Build pour production
npm run build

# Base de données
npx prisma studio          # Interface visuelle
npx prisma migrate dev     # Créer une migration
npm run db:seed           # Re-seed la base

# Générer le client Prisma après modification du schema
npx prisma generate
```

## 🎨 Personnalisation des Couleurs

Les couleurs sont utilisées dans tout le projet:

```tsx
// Rose: #F8A6B0
style={{ backgroundColor: '#F8A6B0' }}
style={{ color: '#F8A6B0' }}

// Jaune: #F1E5B4
style={{ backgroundColor: '#F1E5B4' }}

// Noir: #383738
style={{ color: '#383738' }}
```

## 📱 Test sur Mobile

Le site est responsive. Pour tester:

```bash
# Sur votre réseau local
# Trouvez votre IP: ipconfig (Windows) ou ifconfig (Mac/Linux)
# Puis accédez depuis votre mobile:
http://[VOTRE_IP]:3000
```

## 🐛 Résolution de Problèmes

### Erreur de compilation
```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
```

### Erreur Prisma
```bash
# Régénérer le client
npx prisma generate

# Reset de la base
npx prisma migrate reset
npm run db:seed
```

### Port 3000 déjà utilisé
```bash
# Arrêter le serveur actuel
# Ctrl+C dans le terminal

# Ou changer le port
npm run dev -- -p 3001
```

## 📊 Prisma Studio

Pour gérer visuellement votre base de données:

```bash
npx prisma studio
# Ouvre http://localhost:5555
```

Vous pouvez:
- Voir tous les produits, commandes, avis
- Ajouter/modifier/supprimer des données
- Tester les relations

## 🌐 Déploiement

Pour déployer en production:

1. **Vercel** (recommandé pour Next.js)
   ```bash
   # Installer Vercel CLI
   npm i -g vercel
   
   # Déployer
   vercel
   ```

2. **Configuration Base de Données**
   - Migrer de SQLite vers PostgreSQL
   - Mettre à jour `DATABASE_URL` dans `.env`
   - Run migrations: `npx prisma migrate deploy`

3. **Variables d'environnement**
   - Configurer toutes les variables dans Vercel
   - BETTER_AUTH_URL doit pointer vers votre domaine

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs du serveur dans le terminal
3. Utilisez Prisma Studio pour inspecter la base de données

---

**Bon développement! 🚀**
