/*
  Warnings:

  - You are about to drop the column `materialId` on the `qualities` table. All the data in the column will be lost.
  - You are about to drop the `materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_material` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `componentId` to the `qualities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product_material` DROP FOREIGN KEY `product_material_barcode_fkey`;

-- DropForeignKey
ALTER TABLE `product_material` DROP FOREIGN KEY `product_material_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `qualities` DROP FOREIGN KEY `qualities_materialId_fkey`;

-- AlterTable
ALTER TABLE `products` MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `qualities` DROP COLUMN `materialId`,
    ADD COLUMN `componentId` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `materials`;

-- DropTable
DROP TABLE `product_material`;

-- CreateTable
CREATE TABLE `product_detail` (
    `barcode` VARCHAR(191) NOT NULL,
    `component_id` VARCHAR(255) NOT NULL,
    `min_quantity` INTEGER NOT NULL DEFAULT 1,
    `total_quantity_pieces` INTEGER NOT NULL,
    `total_price` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `total_cost_of_goods_sold` DECIMAL(12, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (`barcode`, `component_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `components` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `image` VARCHAR(100) NULL,
    `type_pieces` VARCHAR(100) NULL,
    `quantity_pieces` INTEGER NOT NULL,
    `price` DECIMAL(12, 2) NULL,
    `cost_of_goods_sold` DECIMAL(12, 2) NULL,
    `flag` ENUM('ACTIVED', 'FAVOURITE', 'DISABLED', 'DELETED') NOT NULL DEFAULT 'ACTIVED',
    `type_component` ENUM('MATERIAL', 'ADDON', 'FINISHING', 'PROCESSING', 'CONSUMING') NULL,
    `can_incrase` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_detail` ADD CONSTRAINT `product_detail_barcode_fkey` FOREIGN KEY (`barcode`) REFERENCES `products`(`barcode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_detail` ADD CONSTRAINT `product_detail_component_id_fkey` FOREIGN KEY (`component_id`) REFERENCES `components`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `qualities` ADD CONSTRAINT `qualities_componentId_fkey` FOREIGN KEY (`componentId`) REFERENCES `components`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
