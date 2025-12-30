-- AlterTable
ALTER TABLE `customers` 
ADD COLUMN `notes` TEXT NULL,
ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `customers_restaurantId_phone_key` ON `customers`(`restaurantId`, `phone`);

-- Migrate existing Brazilian phones to international format (+55)
UPDATE `customers` 
SET `phone` = CONCAT('+55', `phone`) 
WHERE `phone` IS NOT NULL 
  AND `phone` NOT LIKE '+%'
  AND LENGTH(`phone`) >= 10;

-- Migrate existing waitlist entries
UPDATE `waitlist_entries` 
SET `customerPhone` = CONCAT('+55', `customerPhone`) 
WHERE `customerPhone` NOT LIKE '+%'
  AND LENGTH(`customerPhone`) >= 10;

-- Migrate existing reservations
UPDATE `reservations` 
SET `customerPhone` = CONCAT('+55', `customerPhone`) 
WHERE `customerPhone` NOT LIKE '+%'
  AND LENGTH(`customerPhone`) >= 10;
