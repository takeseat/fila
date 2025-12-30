-- AlterTable
ALTER TABLE `waitlist_entries` ADD COLUMN `last_notified_at` DATETIME(3) NULL,
    ADD COLUMN `last_notified_position` INTEGER NULL,
    ADD COLUMN `whatsapp_opt_in` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `whatsapp_opt_in_at` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `restaurant_whatsapp_settings` (
    `id` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `isEnabled` BOOLEAN NOT NULL DEFAULT false,
    `sendWelcome` BOOLEAN NOT NULL DEFAULT false,
    `sendPositionUpdates` BOOLEAN NOT NULL DEFAULT false,
    `sendTurnMessage` BOOLEAN NOT NULL DEFAULT false,
    `welcomeText` TEXT NULL,
    `positionUpdateText` TEXT NULL,
    `yourTurnText` TEXT NULL,
    `minSecondsBetweenUpdates` INTEGER NOT NULL DEFAULT 300,
    `minPositionsChangeToNotify` INTEGER NOT NULL DEFAULT 5,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `restaurant_whatsapp_settings_restaurantId_key`(`restaurantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whatsapp_message_logs` (
    `id` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `queueEntryId` VARCHAR(191) NULL,
    `customerPhone` VARCHAR(191) NOT NULL,
    `messageType` ENUM('WELCOME', 'POSITION_UPDATE', 'YOUR_TURN') NOT NULL,
    `payload` JSON NULL,
    `providerMessageId` VARCHAR(191) NULL,
    `status` ENUM('SENT', 'DELIVERED', 'READ', 'FAILED') NOT NULL DEFAULT 'SENT',
    `errorCode` VARCHAR(191) NULL,
    `errorMessage` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `whatsapp_message_logs_restaurantId_idx`(`restaurantId`),
    INDEX `whatsapp_message_logs_queueEntryId_idx`(`queueEntryId`),
    INDEX `whatsapp_message_logs_customerPhone_idx`(`customerPhone`),
    INDEX `whatsapp_message_logs_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `restaurant_whatsapp_settings` ADD CONSTRAINT `restaurant_whatsapp_settings_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `whatsapp_message_logs` ADD CONSTRAINT `whatsapp_message_logs_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `whatsapp_message_logs` ADD CONSTRAINT `whatsapp_message_logs_queueEntryId_fkey` FOREIGN KEY (`queueEntryId`) REFERENCES `waitlist_entries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
