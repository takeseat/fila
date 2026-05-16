-- Remove parameters tab fields from restaurants table
-- These fields were only used by the Parameters tab in Settings,
-- which has been removed. Defaults are now hardcoded in the application.

ALTER TABLE `restaurants`
  DROP COLUMN IF EXISTS `waitingAlertMinutes`,
  DROP COLUMN IF EXISTS `calledAlertMinutes`,
  DROP COLUMN IF EXISTS `avgWaitWindowMinutes`,
  DROP COLUMN IF EXISTS `avgWaitFallbackMinutes`;
