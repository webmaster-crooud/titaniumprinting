-- CreateTable
CREATE TABLE `products` (
    `barcode` VARCHAR(100) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(200) NOT NULL,
    `image` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `flag` ENUM('ACTIVED', 'FAVOURITE', 'DISABLED', 'DELETED') NOT NULL DEFAULT 'ACTIVED',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX `products_slug_key`(`slug`),
    INDEX `idx_name_barcode`(`name`, `barcode`),
    FULLTEXT INDEX `idx_name_description`(`name`, `description`),
    PRIMARY KEY (`barcode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
