# Quick Reference Guide - Refactored Structure

## 📍 Where to Find Things

### Types
```typescript
// All types now available from:
import { 
  // Common
  Locale, AdminTab, ApiResponse,
  
  // Elogistia
  Wilaya, Municipality, TrackingStatus,
  
  // Products
  Product, ProductVariant, ProductType,
  
  // Orders
  Order, OrderItem, OrderStatus, CustomerInfo,
  
  // Users
  User, UserRole, UserFormData,
  
  // Cart
  CartItem
} from '@/lib/types';
```

### Services
```typescript
// Elogistia services
import { 
  getWilayasWithCosts,
  getshippingCosts,
  calculateShippingCost,
  getMunicipalities,
  getTracking,
  createElogistiaOrder,
  trackingStatuses
} from '@/lib/services/elogistia';
```

### Components

#### Admin Components
```typescript
import { OrderCard } from '@/app/admin/components/order-card';
import { ProductCardAdmin } from '@/app/admin/components/product-card-admin';
import { UserCard } from '@/app/admin/components/user-card';
import { ProductDialog } from '@/app/admin/components/product-dialog';
import { UserDialog } from '@/app/admin/components/user-dialog';
import { ConfirmDialog } from '@/app/admin/components/confirm-dialog';
```

#### Cart Components
```typescript
import { CartItemCard } from '@/app/cart/components/cart-item-card';
import { CustomerInfoForm } from '@/app/cart/components/customer-info-form';
import { OrderSummary } from '@/app/cart/components/order-summary';
import { EmptyCart } from '@/app/cart/components/empty-cart';
```

#### Catalog Components
```typescript
import { ProductFilters } from '@/app/catalog/components/product-filters';
import { ProductsGrid } from '@/app/catalog/components/products-grid';
```

### Hooks
```typescript
// Cart hooks
import { useShipping } from '@/app/cart/hooks/use-shipping';
import { useCheckout } from '@/app/cart/hooks/use-checkout';
```

---

## 📋 Common Tasks

### Adding a New Type
1. Create/update file in `lib/types/`
2. Export from `lib/types/index.ts`

### Adding a New Service
1. Create file in `lib/services/[domain]/`
2. Export from `lib/services/[domain]/index.ts`

### Adding a New Component
- **Global?** → `components/`
- **Feature-specific?** → `app/[feature]/components/`

### Adding a New Hook
1. Create file in `app/[feature]/hooks/`
2. Name with `use` prefix

---

## ⚡ Quick Examples

### Using Types
```typescript
import { Product, Order, User } from '@/lib/types';

const product: Product = { ... };
const order: Order = { ... };
```

### Using Services
```typescript
import { getWilayasWithCosts } from '@/lib/services/elogistia';

const wilayas = await getWilayasWithCosts();
```

### Using Components
```typescript
import { OrderCard } from './components/order-card';

<OrderCard 
  order={order}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

### Using Hooks
```typescript
import { useShipping } from './hooks/use-shipping';

const { wilayas, municipalities } = useShipping(wilayaId, t);
```

---

## 🔄 Backward Compatibility

Old imports still work!

```typescript
// ✅ Still works
import { Wilaya } from '@/lib/elogistia';

// ✅ Recommended for new code
import { Wilaya } from '@/lib/types';
```
