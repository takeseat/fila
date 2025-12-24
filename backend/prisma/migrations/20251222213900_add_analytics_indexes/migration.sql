-- CreateIndex
CREATE INDEX `waitlist_entries_restaurantId_createdAt_idx` ON `waitlist_entries`(`restaurantId`, `createdAt`);

-- CreateIndex
CREATE INDEX `waitlist_entries_restaurantId_status_createdAt_idx` ON `waitlist_entries`(`restaurantId`, `status`, `createdAt`);

-- CreateIndex
CREATE INDEX `waitlist_entries_restaurantId_seatedAt_idx` ON `waitlist_entries`(`restaurantId`, `seatedAt`);

-- CreateIndex
CREATE INDEX `waitlist_entries_restaurantId_calledAt_idx` ON `waitlist_entries`(`restaurantId`, `calledAt`);
