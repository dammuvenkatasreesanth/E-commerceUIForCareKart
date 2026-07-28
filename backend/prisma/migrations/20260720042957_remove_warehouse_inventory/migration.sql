-- DropForeignKey
ALTER TABLE `inventoryitem` DROP FOREIGN KEY `InventoryItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `inventoryitem` DROP FOREIGN KEY `InventoryItem_sizeId_fkey`;

-- DropForeignKey
ALTER TABLE `inventoryitem` DROP FOREIGN KEY `InventoryItem_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `stockmovement` DROP FOREIGN KEY `StockMovement_inventoryItemId_fkey`;

-- DropForeignKey
ALTER TABLE `stockmovement` DROP FOREIGN KEY `StockMovement_performedById_fkey`;

-- DropForeignKey
ALTER TABLE `warehouse` DROP FOREIGN KEY `Warehouse_managerId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `warehouseId`;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('CUSTOMER', 'ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE `inventoryitem`;

-- DropTable
DROP TABLE `stockmovement`;

-- DropTable
DROP TABLE `warehouse`;

