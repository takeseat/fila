-- AlterTable
ALTER TABLE `restaurants` ADD COLUMN `pickupOrdersConfig` JSON NULL,
    ADD COLUMN `pickupOrdersEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pickupOrdersWhatsappEnabled` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `whatsapp_message_logs` ADD COLUMN `pickupOrderId` VARCHAR(191) NULL,
    MODIFY `messageType` ENUM('WELCOME', 'POSITION_UPDATE', 'YOUR_TURN', 'ORDER_CREATED', 'ORDER_READY', 'ORDER_NOT_PICKED_UP') NOT NULL;

-- CreateTable
CREATE TABLE `pickup_orders` (
    `id` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `orderCode` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NULL,
    `customerPhoneE164` VARCHAR(191) NOT NULL,
    `customerCountryCode` VARCHAR(191) NOT NULL DEFAULT 'BR',
    `partySize` INTEGER NULL,
    `notes` TEXT NULL,
    `status` ENUM('CREATED', 'READY_FOR_PICKUP', 'PICKED_UP', 'NOT_PICKED_UP') NOT NULL DEFAULT 'CREATED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `readyAt` DATETIME(3) NULL,
    `pickedUpAt` DATETIME(3) NULL,
    `notPickedUpAt` DATETIME(3) NULL,
    `whatsappOptIn` BOOLEAN NOT NULL DEFAULT true,
    `lastWhatsAppNotifiedAt` DATETIME(3) NULL,
    `source` ENUM('MANUAL', 'API', 'POS') NOT NULL DEFAULT 'MANUAL',
    `createdByUserId` VARCHAR(191) NULL,

    INDEX `pickup_orders_restaurantId_status_createdAt_idx`(`restaurantId`, `status`, `createdAt`),
    INDEX `pickup_orders_restaurantId_orderCode_createdAt_idx`(`restaurantId`, `orderCode`, `createdAt`),
    INDEX `pickup_orders_customerId_idx`(`customerId`),
    INDEX `pickup_orders_createdByUserId_idx`(`createdByUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `whatsapp_message_logs_pickupOrderId_idx` ON `whatsapp_message_logs`(`pickupOrderId`);

-- AddForeignKey
ALTER TABLE `whatsapp_message_logs` ADD CONSTRAINT `whatsapp_message_logs_pickupOrderId_fkey` FOREIGN KEY (`pickupOrderId`) REFERENCES `pickup_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pickup_orders` ADD CONSTRAINT `pickup_orders_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pickup_orders` ADD CONSTRAINT `pickup_orders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pickup_orders` ADD CONSTRAINT `pickup_orders_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
