/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `Broker` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tx_ref]` on the table `Topup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `packageId` to the `Topup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Broker` ADD COLUMN `averageRating` DOUBLE NULL,
    ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `googleId` VARCHAR(191) NULL,
    ADD COLUMN `hasCar` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `resetOtp` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `resetOtpExpiration` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `photo` LONGTEXT NOT NULL,
    MODIFY `approvedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `serviceExprireDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `locationLongtude` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `locationLatitude` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Connection` ADD COLUMN `locationLatitude` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `locationLongtude` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `locationName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `reasonForCancellation` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `status` ENUM('REQUESTED', 'ACCEPTED', 'DECLINED', 'CANCELLED') NOT NULL DEFAULT 'REQUESTED',
    ADD COLUMN `userHasCalled` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Topup` ADD COLUMN `packageId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `googleId` VARCHAR(191) NULL,
    ADD COLUMN `resetOtp` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `resetOtpExpiration` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `photo` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `Rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rating` DOUBLE NOT NULL,
    `comment` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `brokerId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Package` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalDays` DOUBLE NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `discount` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dailyFee` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Broker_googleId_key` ON `Broker`(`googleId`);

-- CreateIndex
CREATE INDEX `Broker_fullName_created_at_phone_approved_locationLatitude_l_idx` ON `Broker`(`fullName`, `created_at`, `phone`, `approved`, `locationLatitude`, `locationLongtude`, `avilableForWork`);

-- CreateIndex
CREATE UNIQUE INDEX `Topup_tx_ref_key` ON `Topup`(`tx_ref`);

-- CreateIndex
CREATE UNIQUE INDEX `User_googleId_key` ON `User`(`googleId`);

-- CreateIndex
CREATE INDEX `User_fullName_created_at_phone_idx` ON `User`(`fullName`, `created_at`, `phone`);

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_brokerId_fkey` FOREIGN KEY (`brokerId`) REFERENCES `Broker`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Topup` ADD CONSTRAINT `Topup_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
