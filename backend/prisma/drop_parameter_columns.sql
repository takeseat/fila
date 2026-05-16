-- Drop parameter columns if they still exist (safe, one-time cleanup)
ALTER TABLE `restaurants`
  DROP COLUMN `waitingAlertMinutes`,
  DROP COLUMN `calledAlertMinutes`,
  DROP COLUMN `avgWaitWindowMinutes`,
  DROP COLUMN `avgWaitFallbackMinutes`;

-- Drop order message columns from restaurant_whatsapp_settings if they still exist
ALTER TABLE `restaurant_whatsapp_settings`
  DROP COLUMN `sendOrderCreated`,
  DROP COLUMN `sendOrderReady`,
  DROP COLUMN `sendOrderNotPickedUp`,
  DROP COLUMN `orderCreatedText`,
  DROP COLUMN `orderReadyText`,
  DROP COLUMN `orderNotPickedUpText`;
