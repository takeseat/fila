-- AlterTable
ALTER TABLE `restaurants` ADD COLUMN `addressComplement` VARCHAR(191) NULL,
    ADD COLUMN `addressLine` VARCHAR(191) NULL,
    ADD COLUMN `addressNumber` VARCHAR(191) NULL,
    ADD COLUMN `countryCode` VARCHAR(191) NULL DEFAULT 'BR',
    ADD COLUMN `postalCode` VARCHAR(191) NULL,
    ADD COLUMN `stateCode` VARCHAR(191) NULL,
    ADD COLUMN `tradeName` VARCHAR(191) NULL;
