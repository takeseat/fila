-- AlterTable
ALTER TABLE `restaurant_whatsapp_settings`
    ADD COLUMN `sendOrderCreated` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `sendOrderReady` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `sendOrderNotPickedUp` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `orderCreatedText` TEXT NULL,
    ADD COLUMN `orderReadyText` TEXT NULL,
    ADD COLUMN `orderNotPickedUpText` TEXT NULL;
