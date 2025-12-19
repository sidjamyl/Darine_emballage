-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "address" TEXT NOT NULL,
    "wilaya" TEXT NOT NULL,
    "wilayaId" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "deliveryType" TEXT NOT NULL,
    "shippingCost" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "trackingNumber" TEXT,
    "trackingStatus" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_order" ("address", "createdAt", "customerEmail", "customerName", "customerPhone", "deliveryType", "id", "municipality", "municipalityId", "notes", "orderNumber", "shippingCost", "status", "subtotal", "total", "trackingNumber", "trackingStatus", "updatedAt", "wilaya", "wilayaId") SELECT "address", "createdAt", "customerEmail", "customerName", "customerPhone", "deliveryType", "id", "municipality", "municipalityId", "notes", "orderNumber", "shippingCost", "status", "subtotal", "total", "trackingNumber", "trackingStatus", "updatedAt", "wilaya", "wilayaId" FROM "order";
DROP TABLE "order";
ALTER TABLE "new_order" RENAME TO "order";
CREATE UNIQUE INDEX "order_orderNumber_key" ON "order"("orderNumber");
CREATE INDEX "order_userId_idx" ON "order"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
