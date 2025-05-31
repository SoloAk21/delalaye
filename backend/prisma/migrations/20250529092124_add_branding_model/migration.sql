/*
  Warnings:

  - You are about to drop the column `addressLine` on the `addresses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_brokerId_fkey`;

-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `addressLine`,
    ADD COLUMN `name` VARCHAR(191) NULL,
    MODIFY `brokerId` INTEGER NULL,
    MODIFY `longitude` DOUBLE NULL DEFAULT 0,
    MODIFY `latitude` DOUBLE NULL DEFAULT 0,
    MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `Branding` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `logoLight` VARCHAR(191) NULL,
    `logoDark` VARCHAR(191) NULL,
    `primaryColor` VARCHAR(191) NOT NULL,
    `secondaryColor` VARCHAR(191) NOT NULL,
    `darkModeDefault` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_brokerId_fkey` FOREIGN KEY (`brokerId`) REFERENCES `Broker`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
