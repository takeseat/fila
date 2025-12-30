/*
  Warnings:

  - You are about to drop the `campaign_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `campaigns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nps_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nps_surveys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `campaign_logs` DROP FOREIGN KEY `campaign_logs_campaignId_fkey`;

-- DropForeignKey
ALTER TABLE `campaign_logs` DROP FOREIGN KEY `campaign_logs_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `campaigns` DROP FOREIGN KEY `campaigns_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `menu_categories` DROP FOREIGN KEY `menu_categories_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `menu_items` DROP FOREIGN KEY `menu_items_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `menu_items` DROP FOREIGN KEY `menu_items_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `nps_responses` DROP FOREIGN KEY `nps_responses_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `nps_responses` DROP FOREIGN KEY `nps_responses_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `nps_responses` DROP FOREIGN KEY `nps_responses_surveyId_fkey`;

-- DropForeignKey
ALTER TABLE `nps_surveys` DROP FOREIGN KEY `nps_surveys_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_restaurantId_fkey`;

-- AlterTable
ALTER TABLE `customers` ADD COLUMN `lastVisitAt` DATETIME(3) NULL,
    ADD COLUMN `totalVisits` INTEGER NOT NULL DEFAULT 0,
    MODIFY `countryCode` VARCHAR(191) NOT NULL,
    MODIFY `ddi` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL,
    MODIFY `fullPhone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `waitlist_entries` MODIFY `customerCountryCode` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `campaign_logs`;

-- DropTable
DROP TABLE `campaigns`;

-- DropTable
DROP TABLE `menu_categories`;

-- DropTable
DROP TABLE `menu_items`;

-- DropTable
DROP TABLE `nps_responses`;

-- DropTable
DROP TABLE `nps_surveys`;

-- DropTable
DROP TABLE `reservations`;
