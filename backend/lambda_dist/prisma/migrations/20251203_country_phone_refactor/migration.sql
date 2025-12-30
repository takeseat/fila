-- Migration: Convert phone data to country-based format
-- This migration adds country fields and converts existing +55 phones

-- Step 1: Add new columns with defaults for existing rows
ALTER TABLE `customers` 
ADD COLUMN `countryCode` VARCHAR(2) DEFAULT 'BR',
ADD COLUMN `ddi` VARCHAR(5) DEFAULT '+55',
ADD COLUMN `phone_local` VARCHAR(20),
ADD COLUMN `fullPhone` VARCHAR(25);

-- Step 2: Migrate existing phone data
-- Assuming all existing phones are Brazilian (+55)
UPDATE `customers` 
SET 
  `countryCode` = 'BR',
  `ddi` = '+55',
  `phone_local` = CASE 
    WHEN `phone` LIKE '+55%' THEN SUBSTRING(`phone`, 4)
    ELSE `phone`
  END,
  `fullPhone` = CASE
    WHEN `phone` LIKE '+%' THEN `phone`
    ELSE CONCAT('+55', `phone`)
  END
WHERE `phone` IS NOT NULL;

-- Step 3: Drop old phone column and rename phone_local to phone
ALTER TABLE `customers` DROP COLUMN `phone`;
ALTER TABLE `customers` CHANGE COLUMN `phone_local` `phone` VARCHAR(20);

-- Step 4: Make new columns NOT NULL
ALTER TABLE `customers` 
MODIFY COLUMN `countryCode` VARCHAR(2) NOT NULL,
MODIFY COLUMN `ddi` VARCHAR(5) NOT NULL,
MODIFY COLUMN `phone` VARCHAR(20) NOT NULL,
MODIFY COLUMN `fullPhone` VARCHAR(25) NOT NULL;

-- Step 5: Drop old unique constraint
ALTER TABLE `customers` DROP INDEX `customers_restaurantId_phone_key`;

-- Step 6: Add new unique constraint on fullPhone
ALTER TABLE `customers` ADD UNIQUE INDEX `customers_restaurantId_fullPhone_key` (`restaurantId`, `fullPhone`);

-- Step 7: Add index on fullPhone
ALTER TABLE `customers` ADD INDEX `customers_fullPhone_idx` (`fullPhone`);

-- Step 8: Add customerCountryCode to waitlist_entries
ALTER TABLE `waitlist_entries` ADD COLUMN `customerCountryCode` VARCHAR(2);

-- Step 9: Set default country code for existing entries
UPDATE `waitlist_entries` SET `customerCountryCode` = 'BR';

-- Step 10: Migrate waitlist phone data
UPDATE `waitlist_entries` 
SET `customerPhone` = CASE
  WHEN `customerPhone` LIKE '+%' THEN `customerPhone`
  ELSE CONCAT('+55', `customerPhone`)
END
WHERE `customerPhone` NOT LIKE '+%';

-- Step 11: Migrate reservations phone data
UPDATE `reservations` 
SET `customerPhone` = CASE
  WHEN `customerPhone` LIKE '+%' THEN `customerPhone`
  ELSE CONCAT('+55', `customerPhone`)
END
WHERE `customerPhone` NOT LIKE '+%';
