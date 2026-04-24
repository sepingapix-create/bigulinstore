CREATE TABLE `settings` (
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_key` PRIMARY KEY(`key`)
);
