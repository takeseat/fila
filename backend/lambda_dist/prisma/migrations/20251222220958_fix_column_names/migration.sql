/*
  Warnings:

  - You are about to drop the column `calledAt` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledAt` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `customerCountryCode` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedWaitMinutes` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `noShowAt` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `partySize` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `waitlist_entries` table. All the data in the column will be lost.
  - You are about to drop the column `seatedAt` on the `waitlist_entries` table. All the data in the column will be lost.
  - Added the required column `customer_name` to the `waitlist_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_phone` to the `waitlist_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `party_size` to the `waitlist_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurant_id` to the `waitlist_entries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `waitlist_entries` DROP FOREIGN KEY `waitlist_entries_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `waitlist_entries` DROP FOREIGN KEY `waitlist_entries_restaurantId_fkey`;

-- DropIndex
DROP INDEX `waitlist_entries_restaurantId_calledAt_idx` ON `waitlist_entries`;

-- DropIndex
DROP INDEX `waitlist_entries_restaurantId_createdAt_idx` ON `waitlist_entries`;

-- DropIndex
DROP INDEX `waitlist_entries_restaurantId_seatedAt_idx` ON `waitlist_entries`;

-- DropIndex
DROP INDEX `waitlist_entries_restaurantId_status_createdAt_idx` ON `waitlist_entries`;

-- DropIndex
DROP INDEX `waitlist_entries_restaurantId_status_idx` ON `waitlist_entries`;

-- AlterTable
ALTER TABLE `waitlist_entries` DROP COLUMN `calledAt`,
    DROP COLUMN `cancelledAt`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `customerCountryCode`,
    DROP COLUMN `customerId`,
    DROP COLUMN `customerName`,
    DROP COLUMN `customerPhone`,
    DROP COLUMN `estimatedWaitMinutes`,
    DROP COLUMN `noShowAt`,
    DROP COLUMN `partySize`,
    DROP COLUMN `restaurantId`,
    DROP COLUMN `seatedAt`,
    ADD COLUMN `called_at` DATETIME(3) NULL,
    ADD COLUMN `cancelled_at` DATETIME(3) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `customer_country_code` VARCHAR(191) NULL,
    ADD COLUMN `customer_id` VARCHAR(191) NULL,
    ADD COLUMN `customer_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `customer_phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `estimated_wait_minutes` INTEGER NULL,
    ADD COLUMN `no_show_at` DATETIME(3) NULL,
    ADD COLUMN `party_size` INTEGER NOT NULL,
    ADD COLUMN `restaurant_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `seated_at` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `waitlist_entries_restaurant_id_status_idx` ON `waitlist_entries`(`restaurant_id`, `status`);

-- CreateIndex
CREATE INDEX `waitlist_entries_customer_id_idx` ON `waitlist_entries`(`customer_id`);

-- CreateIndex
CREATE INDEX `waitlist_entries_restaurant_id_created_at_idx` ON `waitlist_entries`(`restaurant_id`, `created_at`);

-- CreateIndex
CREATE INDEX `waitlist_entries_restaurant_id_status_created_at_idx` ON `waitlist_entries`(`restaurant_id`, `status`, `created_at`);

-- CreateIndex
CREATE INDEX `waitlist_entries_restaurant_id_seated_at_idx` ON `waitlist_entries`(`restaurant_id`, `seated_at`);

-- CreateIndex
CREATE INDEX `waitlist_entries_restaurant_id_called_at_idx` ON `waitlist_entries`(`restaurant_id`, `called_at`);

-- AddForeignKey
ALTER TABLE `waitlist_entries` ADD CONSTRAINT `waitlist_entries_restaurant_id_fkey` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `waitlist_entries` ADD CONSTRAINT `waitlist_entries_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
