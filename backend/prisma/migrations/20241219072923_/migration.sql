-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `brokerId` INTEGER NOT NULL,
    `longitude` DOUBLE NOT NULL DEFAULT 0,
    `latitude` DOUBLE NOT NULL DEFAULT 0,
    `addressLine` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `addresses_brokerId_idx`(`brokerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_brokerId_fkey` FOREIGN KEY (`brokerId`) REFERENCES `Broker`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
