-- Drop parameter columns if they still exist (safe, one-time cleanup)
ALTER TABLE `restaurants`
  DROP COLUMN IF EXISTS `waitingAlertMinutes`,
  DROP COLUMN IF EXISTS `calledAlertMinutes`,
  DROP COLUMN IF EXISTS `avgWaitWindowMinutes`,
  DROP COLUMN IF EXISTS `avgWaitFallbackMinutes`;
