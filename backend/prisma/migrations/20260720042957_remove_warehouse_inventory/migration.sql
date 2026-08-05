-- DropForeignKey
ALTER TABLE `InventoryItem` DROP FOREIGN KEY `InventoryItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryItem` DROP FOREIGN KEY `InventoryItem_sizeId_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryItem` DROP FOREIGN KEY `InventoryItem_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `StockMovement` DROP FOREIGN KEY `StockMovement_inventoryItemId_fkey`;

-- DropForeignKey
ALTER TABLE `StockMovement` DROP FOREIGN KEY `StockMovement_performedById_fkey`;

-- DropForeignKey
ALTER TABLE `Warehouse` DROP FOREIGN KEY `Warehouse_managerId_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `warehouseId`;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('CUSTOMER', 'ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE `InventoryItem`;

-- DropTable
DROP TABLE `StockMovement`;

-- DropTable
DROP TABLE `Warehouse`;

