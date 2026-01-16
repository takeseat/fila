-- AlterTable
ALTER TABLE `restaurant_whatsapp_settings` MODIFY `sendWelcome` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `sendTurnMessage` BOOLEAN NOT NULL DEFAULT true;
