CREATE TABLE `stock_items` (
	`id` varchar(255) NOT NULL,
	`productId` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`usedSlots` int NOT NULL DEFAULT 0,
	`maxSlots` int NOT NULL DEFAULT 1,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stock_items_id` PRIMARY KEY(`id`)
);

CREATE TABLE `stock_deliveries` (
	`id` varchar(255) NOT NULL,
	`orderId` varchar(255) NOT NULL,
	`stockItemId` varchar(255) NOT NULL,
	`deliveredAt` timestamp DEFAULT (now()),
	CONSTRAINT `stock_deliveries_id` PRIMARY KEY(`id`)
);

CREATE TABLE `stock_audit_logs` (
	`id` varchar(255) NOT NULL,
	`adminId` varchar(255) NOT NULL,
	`orderId` varchar(255) NOT NULL,
	`stockItemId` varchar(255) NOT NULL,
	`action` enum('DELIVERY_ADDED','DELIVERY_REMOVED') NOT NULL,
	`details` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `stock_audit_logs_id` PRIMARY KEY(`id`)
);

ALTER TABLE `stock_items` ADD CONSTRAINT `stock_items_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `stock_deliveries` ADD CONSTRAINT `stock_deliveries_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `stock_deliveries` ADD CONSTRAINT `stock_deliveries_stockItemId_stock_items_id_fk` FOREIGN KEY (`stockItemId`) REFERENCES `stock_items`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `stock_audit_logs` ADD CONSTRAINT `stock_audit_logs_adminId_users_id_fk` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
