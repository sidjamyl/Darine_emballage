# Intégration API Elogistia - Guide Complet

## 📋 Vue d'ensemble

L'intégration Elogistia permet:
- Calcul automatique des frais de livraison par wilaya
- Création de commandes dans le système Elogistia
- Suivi des livraisons en temps réel

## 🔑 Configuration

### Clé API

La clé API est configurée dans `lib/elogistia.ts`:

```typescript
const ELOGISTIA_API_KEY = 'e10adc3949banzo25bh5559abbe56e057f20gy1524kbgyc12466byfrdf57883e';
```

**⚠️ Important:** Pour la production, déplacez cette clé dans les variables d'environnement:

```env
# .env
ELOGISTIA_API_KEY=votre_clé_api_ici
```

Puis modifiez `lib/elogistia.ts`:
```typescript
const ELOGISTIA_API_KEY = process.env.ELOGISTIA_API_KEY || '';
```

## 📡 Endpoints Implémentés

### 1. Récupération des Frais de Livraison

**Fonction:** `getShippingCosts()`

**Endpoint:**
```
GET https://api.elogistia.com/getShippingCost/?key={API_KEY}
```

**Réponse:**
```json
[
  {
    "wilayaLabel": "Alger",
    "wilayaID": "16",
    "home": 500,
    "stopdesk": 400
  },
  {
    "wilayaLabel": "Oran",
    "wilayaID": "31",
    "home": 600,
    "stopdesk": 500
  }
]
```

**Utilisation dans le code:**
```typescript
// app/cart/page.tsx
useEffect(() => {
  fetch('/api/elogistia/shipping-costs')
    .then((res) => res.json())
    .then((data) => setWilayas(data));
}, []);
```

**Route API:**
```typescript
// app/api/elogistia/shipping-costs/route.ts
export async function GET() {
  const costs = await getShippingCosts();
  return NextResponse.json(costs);
}
```

### 2. Suivi de Commande

**Fonction:** `getTracking(trackingNumber: string)`

**Endpoint:**
```
GET https://api.elogistia.com/getTracking/?apiKey={API_KEY}&tracking={TRACKING}
```

**Exemple:**
```typescript
const tracking = await getTracking('SEG-35B-00505521');
```

**Réponse:**
```json
{
  "tracking": "SEG-35B-00505521",
  "status": "En cours livraison",
  "history": [
    {
      "date": "2024-12-19T10:00:00Z",
      "status": "Ramassée",
      "location": "Alger Centre"
    },
    {
      "date": "2024-12-19T14:00:00Z",
      "status": "En transit",
      "location": "Hub Alger"
    }
  ]
}
```

**Statuts possibles:**
- Ramassée
- Réceptionnée
- À expédiée
- En transit
- En hub
- En cours livraison
- Livré
- Livrée & réglée
- Suspendue
- Annulée
- Retour en transit
- Retour remis
- Perdue
- Partiel remis

### 3. Création de Commande

**⚠️ À CONFIGURER - Endpoint exact requis**

**Fonction:** `createElogistiaOrder(orderData)`

**Endpoint (à confirmer):**
```
POST https://api.elogistia.com/createOrder
```

**Données envoyées:**
```json
{
  "apiKey": "votre_clé",
  "customerName": "Ahmed Benali",
  "customerPhone": "0555123456",
  "address": "Rue de la Liberté, Cité El Houda",
  "wilayaId": "16",
  "deliveryType": "home",
  "amount": 1500.00,
  "notes": "Order DRN-1234567890"
}
```

**Réponse attendue:**
```json
{
  "success": true,
  "trackingNumber": "SEG-35B-00505521",
  "message": "Commande créée avec succès"
}
```

**Implémentation actuelle:**
```typescript
// lib/elogistia.ts ligne 50
export async function createElogistiaOrder(orderData: {
  customerName: string;
  customerPhone: string;
  address: string;
  wilayaId: string;
  deliveryType: 'home' | 'stopdesk';
  amount: number;
  notes?: string;
}): Promise<{ success: boolean; trackingNumber?: string; error?: string }> {
  // TODO: Remplacer par l'endpoint réel
  const response = await fetch(`${ELOGISTIA_BASE_URL}/createOrder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: ELOGISTIA_API_KEY,
      ...orderData,
    }),
  });
  // ...
}
```

## 🔄 Flux de Commande Complet

### Étape 1: Client crée une commande
```
Client panier → Valide commande
    ↓
app/cart/page.tsx → POST /api/orders
    ↓
Créé en base avec status: DRAFT
```

### Étape 2: Admin confirme la commande
```
Admin → Clique "Confirmer"
    ↓
POST /api/admin/orders/{id}/confirm
    ↓
createElogistiaOrder() appelé
    ↓
Elogistia retourne trackingNumber
    ↓
Status → CONFIRMED
trackingNumber sauvegardé
```

### Étape 3: Suivi de la commande
```
Admin → Visualise le tracking
    ↓
getTracking(trackingNumber)
    ↓
Affichage du statut actuel
```

## 🛠️ Configuration pour Production

### 1. Tester l'endpoint de création

Avant de passer en production, testez avec Postman ou cURL:

```bash
curl -X POST https://api.elogistia.com/createOrder \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "votre_clé",
    "customerName": "Test Client",
    "customerPhone": "0555123456",
    "address": "Test Address",
    "wilayaId": "16",
    "deliveryType": "home",
    "amount": 1000.00
  }'
```

### 2. Mettre à jour le code

Une fois l'endpoint confirmé, mettez à jour `lib/elogistia.ts`:

```typescript
// Ligne 50+
export async function createElogistiaOrder(orderData) {
  try {
    const response = await fetch(`${ELOGISTIA_BASE_URL}/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez d'autres headers si nécessaire
        'Authorization': `Bearer ${ELOGISTIA_API_KEY}`,
      },
      body: JSON.stringify({
        // Adaptez la structure selon la doc Elogistia
        ...orderData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order in Elogistia');
    }

    const data = await response.json();
    return {
      success: true,
      trackingNumber: data.trackingNumber || data.tracking,
    };
  } catch (error) {
    console.error('Error creating Elogistia order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

### 3. Gestion des erreurs

Si l'API Elogistia échoue:
```typescript
// app/api/admin/orders/[id]/[action]/route.ts
if (elogistiaResult.success) {
  // OK - Update avec tracking
} else {
  // KO - Marquer confirmé mais noter l'erreur
  // L'admin pourra créer manuellement la commande
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status: 'CONFIRMED',
      notes: `Elogistia error: ${elogistiaResult.error}`,
    },
  });
}
```

## 📊 Monitoring et Logs

### Activer les logs détaillés

```typescript
// lib/elogistia.ts
export async function createElogistiaOrder(orderData) {
  console.log('[Elogistia] Creating order:', orderData);
  
  try {
    const response = await fetch(/* ... */);
    console.log('[Elogistia] Response status:', response.status);
    
    const data = await response.json();
    console.log('[Elogistia] Response data:', data);
    
    return { success: true, trackingNumber: data.tracking };
  } catch (error) {
    console.error('[Elogistia] Error:', error);
    return { success: false, error: error.message };
  }
}
```

### Dashboard de suivi

Pour un monitoring avancé, vous pouvez:
1. Créer une page `/admin/tracking`
2. Afficher toutes les commandes avec leur statut
3. Rafraîchir automatiquement via l'API de tracking

```typescript
// Example: Auto-refresh tracking
useEffect(() => {
  const interval = setInterval(async () => {
    for (const order of confirmedOrders) {
      if (order.trackingNumber) {
        const status = await fetch(`/api/elogistia/tracking/${order.trackingNumber}`);
        // Update order status
      }
    }
  }, 60000); // Every minute
  
  return () => clearInterval(interval);
}, [confirmedOrders]);
```

## 🔒 Sécurité

### 1. Protection de la clé API

❌ **Ne jamais:**
```typescript
// Dans le code client
const apiKey = 'votre_clé'; // DANGER!
```

✅ **Toujours:**
```typescript
// Côté serveur uniquement (API routes ou server components)
const apiKey = process.env.ELOGISTIA_API_KEY;
```

### 2. Validation des données

```typescript
// Valider avant d'envoyer à Elogistia
if (!orderData.customerPhone.match(/^0[5-7][0-9]{8}$/)) {
  throw new Error('Invalid phone number');
}

if (!orderData.wilayaId.match(/^\d{1,2}$/)) {
  throw new Error('Invalid wilaya ID');
}
```

### 3. Rate limiting

Implémentez un rate limiter pour éviter l'abus:
```typescript
// Exemple avec un simple cache
const lastCall = new Map();

export async function createElogistiaOrder(orderData) {
  const key = orderData.customerPhone;
  const now = Date.now();
  const last = lastCall.get(key);
  
  if (last && now - last < 60000) { // 1 minute
    throw new Error('Too many requests');
  }
  
  lastCall.set(key, now);
  // ...
}
```

## 📞 Contact Elogistia

Pour toute question concernant l'API:
- Documentation: [À demander à Elogistia]
- Support: [Contact Elogistia]
- Test API Key: [Environnement de test si disponible]

## ✅ Checklist de Production

- [ ] Clé API en variable d'environnement
- [ ] Endpoint de création confirmé et testé
- [ ] Gestion d'erreurs robuste
- [ ] Logs de monitoring en place
- [ ] Validation des données côté serveur
- [ ] Rate limiting configuré
- [ ] Tests avec des commandes réelles
- [ ] Documentation du flux de commande
- [ ] Formation de l'équipe admin

---

**Note:** Ce fichier sera mis à jour au fur et à mesure que vous obtenez plus d'informations de la part d'Elogistia.
