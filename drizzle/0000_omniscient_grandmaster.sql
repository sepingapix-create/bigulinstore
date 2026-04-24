CREATE TABLE `accounts` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `accounts_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `affiliateReferrals` (
	`id` varchar(255) NOT NULL,
	`affiliateId` varchar(255) NOT NULL,
	`orderId` varchar(255) NOT NULL,
	`commissionAmount` decimal(10,2) NOT NULL,
	`status` varchar(20) DEFAULT 'PENDING',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `affiliateReferrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliateVisits` (
	`id` varchar(255) NOT NULL,
	`affiliateId` varchar(255) NOT NULL,
	`visitorIp` varchar(100),
	`userAgent` text,
	`referrerUrl` varchar(500),
	`convertedToUser` boolean DEFAULT false,
	`convertedToSale` boolean DEFAULT false,
	`userId` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `affiliateVisits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `affiliates` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`handle` varchar(50) NOT NULL,
	`commissionRate` int DEFAULT 10,
	`balance` decimal(10,2) DEFAULT '0.00',
	`totalEarned` decimal(10,2) DEFAULT '0.00',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `affiliates_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliates_handle_unique` UNIQUE(`handle`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`code` varchar(50) NOT NULL,
	`discountPercentage` int NOT NULL,
	`maxUses` int DEFAULT 100,
	`usedCount` int DEFAULT 0,
	`expiresAt` timestamp,
	`isActive` boolean DEFAULT true,
	`affiliateId` varchar(255),
	CONSTRAINT `coupons_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` varchar(255) NOT NULL,
	`orderId` varchar(255) NOT NULL,
	`productId` varchar(255) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`priceAtPurchase` decimal(10,2) NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`status` enum('PENDING','PAID','CANCELLED') NOT NULL DEFAULT 'PENDING',
	`totalAmount` decimal(10,2) NOT NULL,
	`discountAmount` decimal(10,2) DEFAULT '0.00',
	`couponCode` varchar(50),
	`pixCode` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_inventory` (
	`id` varchar(255) NOT NULL,
	`productId` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`isSold` boolean DEFAULT false,
	`orderId` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `product_inventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`originalPrice` decimal(10,2),
	`isFlashDeal` boolean DEFAULT false,
	`flashDealEnd` timestamp,
	`category` varchar(100) NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`imageUrl` varchar(500) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3),
	`password` varchar(255),
	`image` varchar(255),
	`role` varchar(20) DEFAULT 'USER',
	`isAffiliate` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `withdrawals` (
	`id` varchar(255) NOT NULL,
	`affiliateId` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`pixKey` varchar(255) NOT NULL,
	`pixKeyType` varchar(50) NOT NULL,
	`status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
	`adminNotes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `withdrawals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `affiliateReferrals` ADD CONSTRAINT `affiliateReferrals_affiliateId_affiliates_id_fk` FOREIGN KEY (`affiliateId`) REFERENCES `affiliates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `affiliateReferrals` ADD CONSTRAINT `affiliateReferrals_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `affiliateVisits` ADD CONSTRAINT `affiliateVisits_affiliateId_affiliates_id_fk` FOREIGN KEY (`affiliateId`) REFERENCES `affiliates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `affiliates` ADD CONSTRAINT `affiliates_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `withdrawals` ADD CONSTRAINT `withdrawals_affiliateId_affiliates_id_fk` FOREIGN KEY (`affiliateId`) REFERENCES `affiliates`(`id`) ON DELETE no action ON UPDATE no action;