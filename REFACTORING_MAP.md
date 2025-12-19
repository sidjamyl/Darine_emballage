# Code Refactoring Documentation

## Project: Darine Website - Next.js E-commerce Platform

**Date:** December 19, 2025  
**Type:** Structure Refactoring (No Logic Changes)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Refactoring Summary](#refactoring-summary)
3. [New Project Structure](#new-project-structure)
4. [Detailed File Mappings](#detailed-file-mappings)
5. [Import Path Changes](#import-path-changes)
6. [Component Organization](#component-organization)
7. [Migration Guide](#migration-guide)

---

## 🎯 Overview

This refactoring reorganizes the codebase for improved maintainability, readability, and scalability while **preserving all existing functionality**. No code logic was modified—only file organization and structure.

### Goals Achieved
✅ Separated large files into smaller, focused modules  
✅ Extracted TypeScript types into dedicated files  
✅ Created reusable UI components from page files  
✅ Organized services by domain  
✅ Added comprehensive documentation  
✅ Maintained backward compatibility  

---

## 📊 Refactoring Summary

### Statistics
- **New Type Files Created:** 6
- **Service Files Created:** 5
- **Component Files Created:** 13
- **Hook Files Created:** 2
- **Total Files Added:** 26
- **Files Modified:** 1 (lib/elogistia.ts - now re-exports)

---

## 🗂️ New Project Structure

```
lib/
├── types/                          # ✨ NEW: All TypeScript type definitions
│   ├── index.ts                    # Central export point
│   ├── common.types.ts             # Shared types (Locale, ApiResponse, etc.)
│   ├── elogistia.types.ts          # Elogistia delivery service types
│   ├── product.types.ts            # Product and variant types
│   ├── order.types.ts              # Order and order item types
│   ├── user.types.ts               # User account types
│   └── cart.types.ts               # Shopping cart types
│
├── services/                       # ✨ NEW: Business logic services
│   └── elogistia/                  # Elogistia delivery integration
│       ├── index.ts                # Service export point
│       ├── config.ts               # API configuration
│       ├── wilayas.service.ts      # Wilaya and shipping costs
│       ├── municipalities.service.ts # Municipality operations
│       ├── tracking.service.ts     # Order tracking
│       └── orders.service.ts       # Order creation
│
├── elogistia.ts                    # 🔄 MODIFIED: Now re-exports from services
├── auth-client.ts
├── auth-server.ts
├── auth.ts
├── cart-context.tsx
├── cloudinary.ts
├── i18n.ts
├── language-context.tsx
├── prisma.ts
└── utils.ts

app/
├── admin/
│   ├── page.tsx                    # Main admin page (will be updated)
│   └── components/                 # ✨ NEW: Admin-specific components
│       ├── order-card.tsx          # Order display card
│       ├── product-card-admin.tsx  # Product card with admin actions
│       ├── user-card.tsx           # User account card
│       ├── product-dialog.tsx      # Product create/edit dialog
│       ├── user-dialog.tsx         # User create dialog
│       └── confirm-dialog.tsx      # Generic confirmation dialog
│
├── cart/
│   ├── page.tsx                    # Main cart page (will be updated)
│   ├── components/                 # ✨ NEW: Cart-specific components
│   │   ├── cart-item-card.tsx      # Individual cart item
│   │   ├── customer-info-form.tsx  # Customer delivery form
│   │   ├── order-summary.tsx       # Order totals and checkout
│   │   └── empty-cart.tsx          # Empty cart state
│   └── hooks/                      # ✨ NEW: Cart custom hooks
│       ├── use-shipping.ts         # Shipping data management
│       └── use-checkout.ts         # Checkout logic
│
├── catalog/
│   ├── page.tsx                    # Main catalog page (will be updated)
│   └── components/                 # ✨ NEW: Catalog-specific components
│       ├── product-filters.tsx     # Search and filter controls
│       └── products-grid.tsx       # Product grid display
│
├── about/
├── api/
├── auth/
├── contact/
├── login/
└── ...

components/                          # Shared/global components
├── footer.tsx
├── hero-slider.tsx
├── language-switcher.tsx
├── navbar.tsx
├── product-card.tsx
├── reviews-slider.tsx
└── ui/
```

---

## 📁 Detailed File Mappings

### 1. Type Definitions (Extracted from Various Files)

#### From `lib/elogistia.ts` → Multiple Type Files

| **Original Location** | **New Location** | **Types Moved** |
|----------------------|------------------|-----------------|
| `lib/elogistia.ts` (lines 6-27) | `lib/types/elogistia.types.ts` | `Wilaya`, `Municipality`, `TrackingStatus`, `ShippingCost`, `DeliveryType`, `CreateElogistiaOrderData`, `CreateElogistiaOrderResponse` |

#### From Page Files → Type Files

| **Original Location** | **New Location** | **Types Extracted** |
|----------------------|------------------|---------------------|
| `app/admin/page.tsx` (lines 30-75) | `lib/types/order.types.ts` | `Order`, `OrderItem`, `OrderStatus` |
| `app/admin/page.tsx` (lines 77-87) | `lib/types/product.types.ts` | `Product`, `ProductVariant` |
| `app/admin/page.tsx` (lines 89-94) | `lib/types/user.types.ts` | `User`, `UserFormData` |
| `app/cart/page.tsx` (lines 23-42) | `lib/types/elogistia.types.ts`, `lib/types/order.types.ts` | `Wilaya`, `ShippingCost`, `Municipality`, `CustomerInfo` |

#### New Type Files Created

**`lib/types/common.types.ts`**
```typescript
- Locale: 'fr' | 'ar'
- AdminTab: 'orders' | 'products' | 'users'
- ApiResponse<T>
```

**`lib/types/cart.types.ts`**
```typescript
- CartItem
```

**`lib/types/product.types.ts`**
```typescript
- ProductType: 'FOOD' | 'PACKAGING'
- Product
- ProductVariant
- ProductWithVariants
- ProductFormData
```

**`lib/types/order.types.ts`**
```typescript
- OrderStatus
- OrderItem
- Order
- CustomerInfo
```

**`lib/types/user.types.ts`**
```typescript
- UserRole: 'USER' | 'ADMIN'
- User
- UserFormData
```

**`lib/types/elogistia.types.ts`**
```typescript
- Wilaya
- Municipality
- ShippingCost
- TrackingStatus
- DeliveryType / DeliveryTypeUpper
- CreateElogistiaOrderData
- CreateElogistiaOrderResponse
```

---

### 2. Service Layer Refactoring

#### From `lib/elogistia.ts` (254 lines) → 5 Service Files

| **Function/Constant** | **Original Lines** | **New Location** | **Purpose** |
|----------------------|-------------------|------------------|-------------|
| `ELOGISTIA_API_KEY`, `ELOGISTIA_BASE_URL` | 3-4 | `lib/services/elogistia/config.ts` | API configuration |
| `getWilayasWithCosts()` | 29-51 | `lib/services/elogistia/wilayas.service.ts` | Fetch provinces with costs |
| `getshippingCosts()` | 52-70 | `lib/services/elogistia/wilayas.service.ts` | Fetch shipping costs |
| `calculateShippingCost()` | 104-111 | `lib/services/elogistia/wilayas.service.ts` | Calculate cost by type |
| `getMunicipalities()` | 75-100 | `lib/services/elogistia/municipalities.service.ts` | Fetch municipalities |
| `getTracking()` | 116-132 | `lib/services/elogistia/tracking.service.ts` | Get tracking status |
| `trackingStatuses` | 217-254 | `lib/services/elogistia/tracking.service.ts` | Status translations |
| `splitName()` (private) | 137-146 | `lib/services/elogistia/orders.service.ts` | Name parsing helper |
| `createElogistiaOrder()` | 151-213 | `lib/services/elogistia/orders.service.ts` | Create delivery order |

**Service Index File:**
- `lib/services/elogistia/index.ts` - Re-exports all services for clean imports

---

### 3. Component Extraction

#### Admin Page Components (from `app/admin/page.tsx`)

| **Component** | **Original Lines** | **New File** | **Responsibility** |
|--------------|-------------------|--------------|-------------------|
| OrderCard | Inline in page | `app/admin/components/order-card.tsx` | Display order details |
| ProductCardAdmin | Inline in page | `app/admin/components/product-card-admin.tsx` | Product with edit/delete |
| UserCard | Inline in page | `app/admin/components/user-card.tsx` | User account display |
| ProductDialog | Inline (700+ lines) | `app/admin/components/product-dialog.tsx` | Product creation/editing |
| UserDialog | Inline | `app/admin/components/user-dialog.tsx` | User creation |
| ConfirmDialog | Inline | `app/admin/components/confirm-dialog.tsx` | Order action confirmation |

#### Cart Page Components (from `app/cart/page.tsx`)

| **Component** | **Original Lines** | **New File** | **Responsibility** |
|--------------|-------------------|--------------|-------------------|
| CartItemCard | Inline (~242-280) | `app/cart/components/cart-item-card.tsx` | Single cart item display |
| CustomerInfoForm | Inline (~295-420) | `app/cart/components/customer-info-form.tsx` | Delivery information form |
| OrderSummary | Inline (~425-460) | `app/cart/components/order-summary.tsx` | Totals and checkout button |
| EmptyCart | Inline (~220-240) | `app/cart/components/empty-cart.tsx` | Empty cart state |

**Cart Hooks Created:**
- `app/cart/hooks/use-shipping.ts` - Manages wilaya/municipality/shipping data
- `app/cart/hooks/use-checkout.ts` - Handles order submission logic

#### Catalog Page Components (from `app/catalog/page.tsx`)

| **Component** | **Original Lines** | **New File** | **Responsibility** |
|--------------|-------------------|--------------|-------------------|
| ProductFilters | Inline (~72-144) | `app/catalog/components/product-filters.tsx` | Search and filter UI |
| ProductsGrid | Inline (~147-163) | `app/catalog/components/products-grid.tsx` | Product grid with empty state |

---

## 🔄 Import Path Changes

### Before Refactoring

```typescript
// Importing types from page files (not ideal)
import { Order, Product, User } from '../admin/page';

// All functions from one large file
import { 
  getWilayasWithCosts,
  getMunicipalities,
  createElogistiaOrder 
} from '@/lib/elogistia';
```

### After Refactoring

```typescript
// Clean type imports
import { Order, Product, User } from '@/lib/types';

// Or specific imports
import { Order, OrderStatus } from '@/lib/types/order.types';
import { Product, ProductVariant } from '@/lib/types/product.types';

// Service imports (recommended for new code)
import { getWilayasWithCosts } from '@/lib/services/elogistia/wilayas.service';
import { getMunicipalities } from '@/lib/services/elogistia/municipalities.service';
import { createElogistiaOrder } from '@/lib/services/elogistia/orders.service';

// Or use the service index
import { 
  getWilayasWithCosts,
  getMunicipalities,
  createElogistiaOrder 
} from '@/lib/services/elogistia';

// Backward compatible (still works!)
import { getWilayasWithCosts } from '@/lib/elogistia'; // ✅ Still works
```

---

## 🧩 Component Organization

### Component Hierarchy

```
📦 components/
├── 🌍 Global Components (used across app)
│   ├── footer.tsx
│   ├── navbar.tsx
│   ├── hero-slider.tsx
│   ├── product-card.tsx
│   ├── reviews-slider.tsx
│   └── language-switcher.tsx
│
└── ui/                          # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    └── ...

📦 app/admin/components/         # 🔐 Admin-only components
├── order-card.tsx
├── product-card-admin.tsx
├── user-card.tsx
├── product-dialog.tsx
├── user-dialog.tsx
└── confirm-dialog.tsx

📦 app/cart/components/          # 🛒 Cart-specific components
├── cart-item-card.tsx
├── customer-info-form.tsx
├── order-summary.tsx
└── empty-cart.tsx

📦 app/catalog/components/       # 📚 Catalog-specific components
├── product-filters.tsx
└── products-grid.tsx
```

### When to Use Which?

| **Component Location** | **Use When** | **Examples** |
|----------------------|-------------|-------------|
| `components/` | Used in multiple pages/features | Navbar, Footer, ProductCard |
| `app/[feature]/components/` | Only used in that specific feature | AdminOrderCard, CartSummary |
| `components/ui/` | Base UI primitives | Button, Dialog, Input |

---

## 🚀 Migration Guide

### For Developers Working on Existing Code

#### 1. **Updating Imports in Existing Files**

**Old way:**
```typescript
import { Wilaya, Municipality } from '@/lib/elogistia';
```

**New way (recommended):**
```typescript
import { Wilaya, Municipality } from '@/lib/types';
```

**Or keep using the old way (backward compatible):**
```typescript
import { Wilaya, Municipality } from '@/lib/elogistia'; // ✅ Still works!
```

#### 2. **Using the New Components**

**Example: Updating Admin Page**

```typescript
// Before: Everything inline in page.tsx
export default function AdminPage() {
  return (
    <div>
      {/* 1000+ lines of JSX */}
    </div>
  );
}

// After: Clean component composition
import { OrderCard } from './components/order-card';
import { ProductDialog } from './components/product-dialog';
import { UserCard } from './components/user-card';

export default function AdminPage() {
  // Business logic here
  
  return (
    <div>
      {orders.map(order => (
        <OrderCard 
          key={order.id} 
          order={order}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ))}
    </div>
  );
}
```

#### 3. **Using Services Instead of Direct Imports**

**Before:**
```typescript
import { getWilayasWithCosts, getMunicipalities } from '@/lib/elogistia';

// Usage
const wilayas = await getWilayasWithCosts();
```

**After (recommended for new code):**
```typescript
import { getWilayasWithCosts, getMunicipalities } from '@/lib/services/elogistia';

// Usage - exactly the same!
const wilayas = await getWilayasWithCosts();
```

#### 4. **Using Custom Hooks**

**Cart Page - Before:**
```typescript
// All logic inline in component (100+ lines)
export default function CartPage() {
  const [wilayas, setWilayas] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  
  useEffect(() => {
    // Fetch wilayas
    fetch('/api/elogistia/wilayas')
      .then(res => res.json())
      .then(data => setWilayas(data));
  }, []);
  
  useEffect(() => {
    // Fetch municipalities
    if (wilayaId) {
      fetch(`/api/elogistia/municipalities/${wilayaId}`)
        .then(res => res.json())
        .then(data => setMunicipalities(data));
    }
  }, [wilayaId]);
  
  // ... 50 more lines
}
```

**After:**
```typescript
import { useShipping } from './hooks/use-shipping';
import { useCheckout } from './hooks/use-checkout';

export default function CartPage() {
  const { wilayas, municipalities, shippingCosts } = useShipping(wilayaId, t);
  const { isSubmitting, handleCheckout } = useCheckout(items, clearCart, locale, t);
  
  // Clean, focused component logic
}
```

---

## 📝 Benefits of This Refactoring

### Before

❌ **Problems:**
- `lib/elogistia.ts`: 254 lines, multiple responsibilities
- `app/admin/page.tsx`: 1125 lines, difficult to navigate
- `app/cart/page.tsx`: 467 lines, complex state management
- Types scattered across files
- Hard to test individual components
- Difficult to reuse code

### After

✅ **Improvements:**
- **Single Responsibility:** Each file has one clear purpose
- **Discoverability:** Easy to find where functionality lives
- **Reusability:** Components can be used independently
- **Testability:** Small, focused units easy to test
- **Maintainability:** Changes isolated to specific files
- **Type Safety:** Centralized type definitions
- **Documentation:** Each file clearly documented
- **Scalability:** Easy to add new features

---

## 🔍 File Size Comparison

| **File** | **Before (lines)** | **After (lines)** | **Improvement** |
|----------|-------------------|-------------------|-----------------|
| `lib/elogistia.ts` | 254 | 33 (re-exports) | -87% |
| `app/admin/page.tsx` | 1125 | ~400* | -64% |
| `app/cart/page.tsx` | 467 | ~150* | -68% |
| `app/catalog/page.tsx` | 163 | ~60* | -63% |

*Estimated after component extraction (pages need to be updated to use new components)

---

## 🎓 Best Practices Going Forward

### 1. **Type Organization**
- Always define types in `lib/types/`
- Group related types by domain
- Export types through `lib/types/index.ts`

### 2. **Service Layer**
- Put business logic in `lib/services/`
- One service per domain/API
- Export through service index files

### 3. **Components**
- Global components → `components/`
- Feature-specific → `app/[feature]/components/`
- Keep components under 150 lines
- One component per file

### 4. **Hooks**
- Custom hooks → `app/[feature]/hooks/`
- Name with `use` prefix
- Keep hooks focused on single concern

### 5. **Documentation**
- Add file header comments
- Document complex functions
- Explain non-obvious logic

---

## ✅ Checklist for Completing Migration

- [x] Create type definition files
- [x] Split elogistia.ts into services
- [x] Extract admin components
- [x] Extract cart components
- [x] Extract catalog components
- [x] Create custom hooks for cart
- [x] Update lib/elogistia.ts to re-export
- [ ] Update app/admin/page.tsx to use new components
- [ ] Update app/cart/page.tsx to use new components
- [ ] Update app/catalog/page.tsx to use new components
- [ ] Test all functionality works correctly
- [ ] Update any other files importing from old locations

---

## 📞 Questions?

If you have questions about:
- Where a specific function moved to
- How to use the new structure
- Best practices for new code

Refer to this document or check the file headers for documentation.

---

**End of Refactoring Documentation**
