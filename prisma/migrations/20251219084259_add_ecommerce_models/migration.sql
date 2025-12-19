-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'FOOD',
    "image" TEXT NOT NULL,
    "hasVariants" BOOLEAN NOT NULL DEFAULT false,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "product_variant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "priceAdjustment" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "address" TEXT NOT NULL,
    "wilaya" TEXT NOT NULL,
    "wilayaId" TEXT NOT NULL,
    "deliveryType" TEXT NOT NULL,
    "shippingCost" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "trackingNumber" TEXT,
    "trackingStatus" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "variantName" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT,
    "rating" INTEGER,
    "reviewFr" TEXT NOT NULL,
    "reviewAr" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "hero_slide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "subtitleFr" TEXT,
    "subtitleAr" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "product_variant_productId_idx" ON "product_variant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "order_orderNumber_key" ON "order"("orderNumber");

-- CreateIndex
CREATE INDEX "order_item_orderId_idx" ON "order_item"("orderId");

-- CreateIndex
CREATE INDEX "order_item_productId_idx" ON "order_item"("productId");
