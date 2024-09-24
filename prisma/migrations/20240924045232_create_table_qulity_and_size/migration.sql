/*
  Warnings:

  - Added the required column `name` to the `qualities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `materials` MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `products` MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `qualities` ADD COLUMN `flag` ENUM('ACTIVED', 'FAVOURITE', 'DISABLED', 'DELETED') NOT NULL DEFAULT 'ACTIVED',
    ADD COLUMN `image` VARCHAR(100) NULL,
    ADD COLUMN `name` VARCHAR(100) NOT NULL,
    ADD COLUMN `orientation` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `sizes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qualityId` INTEGER NOT NULL,
    `width` DOUBLE NULL,
    `height` DOUBLE NULL,
    `weight` FLOAT NULL,
    `price` DECIMAL(12, 2) NULL,
    `cost_of_goods_sold` DECIMAL(12, 2) NULL,
    `image` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `qualities` ADD CONSTRAINT `qualities_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `materials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sizes` ADD CONSTRAINT `sizes_qualityId_fkey` FOREIGN KEY (`qualityId`) REFERENCES `qualities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
