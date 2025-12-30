-- AlterTable
ALTER TABLE `restaurants` ADD COLUMN `avgWaitFallbackMinutes` INTEGER NULL DEFAULT 15,
    ADD COLUMN `avgWaitWindowMinutes` INTEGER NULL DEFAULT 90;
