-- AlterTable
ALTER TABLE `customers` ADD COLUMN `whatsappOptIn` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `whatsappOptInAt` DATETIME(3) NULL,
    ADD COLUMN `whatsappOptInSource` VARCHAR(191) NULL;
