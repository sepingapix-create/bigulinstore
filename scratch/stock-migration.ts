import { db } from "../db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Running migration to create stock system tables...");
  try {
    // 1. stock_items
    console.log("Creating stock_items table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`stock_items\` (
        \`id\` varchar(255) NOT NULL,
        \`productId\` varchar(255) NOT NULL,
        \`content\` text NOT NULL,
        \`usedSlots\` int NOT NULL DEFAULT 0,
        \`maxSlots\` int NOT NULL DEFAULT 1,
        \`createdAt\` timestamp DEFAULT (now()),
        \`updatedAt\` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT \`stock_items_id\` PRIMARY KEY(\`id\`),
        CONSTRAINT \`stock_items_productId_products_id_fk\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // 2. stock_deliveries
    console.log("Creating stock_deliveries table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`stock_deliveries\` (
        \`id\` varchar(255) NOT NULL,
        \`orderId\` varchar(255) NOT NULL,
        \`stockItemId\` varchar(255) NOT NULL,
        \`deliveredAt\` timestamp DEFAULT (now()),
        CONSTRAINT \`stock_deliveries_id\` PRIMARY KEY(\`id\`),
        CONSTRAINT \`stock_deliveries_orderId_orders_id_fk\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`stock_deliveries_stockItemId_stock_items_id_fk\` FOREIGN KEY (\`stockItemId\`) REFERENCES \`stock_items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // 3. stock_audit_logs
    console.log("Creating stock_audit_logs table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`stock_audit_logs\` (
        \`id\` varchar(255) NOT NULL,
        \`adminId\` varchar(255) NOT NULL,
        \`orderId\` varchar(255) NOT NULL,
        \`stockItemId\` varchar(255) NOT NULL,
        \`action\` enum('DELIVERY_ADDED','DELIVERY_REMOVED') NOT NULL,
        \`details\` text,
        \`createdAt\` timestamp DEFAULT (now()),
        CONSTRAINT \`stock_audit_logs_id\` PRIMARY KEY(\`id\`),
        CONSTRAINT \`stock_audit_logs_adminId_users_id_fk\` FOREIGN KEY (\`adminId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
  process.exit(0);
}

main();
