-- AlterTable
ALTER TABLE `restaurants` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `users` MODIFY `restaurantId` VARCHAR(191) NULL,
    MODIFY `role` ENUM('SYSADMIN', 'ADMIN', 'MANAGER', 'HOSTESS') NOT NULL DEFAULT 'MANAGER';

-- CreateTable
CREATE TABLE `impersonation_logs` (
    `id` VARCHAR(191) NOT NULL,
    `sysadminUserId` VARCHAR(191) NOT NULL,
    `targetRestaurantId` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `reason` TEXT NULL,
    `correlationId` VARCHAR(191) NULL,

    INDEX `impersonation_logs_sysadminUserId_idx`(`sysadminUserId`),
    INDEX `impersonation_logs_targetRestaurantId_idx`(`targetRestaurantId`),
    INDEX `impersonation_logs_startedAt_idx`(`startedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `impersonation_logs` ADD CONSTRAINT `impersonation_logs_sysadminUserId_fkey` FOREIGN KEY (`sysadminUserId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `impersonation_logs` ADD CONSTRAINT `impersonation_logs_targetRestaurantId_fkey` FOREIGN KEY (`targetRestaurantId`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
