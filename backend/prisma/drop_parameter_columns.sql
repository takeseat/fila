-- Drop parameter columns if they still exist (safe, one-time cleanup)
ALTER TABLE `restaurants`
  DROP COLUMN `waitingAlertMinutes`,
  DROP COLUMN `calledAlertMinutes`,
  DROP COLUMN `avgWaitWindowMinutes`,
  DROP COLUMN `avgWaitFallbackMinutes`;
