-- CreateTable
CREATE TABLE `product_material` (
    `barcode` VARCHAR(191) NOT NULL,
    `material_id` VARCHAR(255) NOT NULL,
    `min_quantity` INTEGER NOT NULL DEFAULT 1,
    `total_quantity_pieces` INTEGER NOT NULL,
    `total_price` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `total_cost_of_goods_sold` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `type_material` ENUM('BASE', 'ADDON') NOT NULL DEFAULT 'ADDON',
    `can_incrase` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `product_material_barcode_key`(`barcode`),
    UNIQUE INDEX `product_material_material_id_key`(`material_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materials` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `image` VARCHAR(100) NULL,
    `type_pieces` VARCHAR(100) NULL,
    `quantity_pieces` INTEGER NOT NULL,
    `price` DECIMAL(12, 2) NULL,
    `cost_of_goods_sold` DECIMAL(12, 2) NULL,
    `flag` ENUM('ACTIVED', 'FAVOURITE', 'DISABLED', 'DELETED') NOT NULL DEFAULT 'ACTIVED',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_material` ADD CONSTRAINT `product_material_barcode_fkey` FOREIGN KEY (`barcode`) REFERENCES `products`(`barcode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_material` ADD CONSTRAINT `product_material_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
