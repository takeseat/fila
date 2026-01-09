-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL,
    ADD COLUMN `verificationToken` VARCHAR(191) NULL,
    ADD COLUMN `verificationTokenExpiresAt` DATETIME(3) NULL,
    MODIFY `isActive` BOOLEAN NOT NULL DEFAULT false;
