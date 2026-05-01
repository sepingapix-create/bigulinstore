import { db } from "../db/index";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Applying manual migrations...");
  
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`stock_items\` (
        \`id\` varchar(255) NOT NULL,
        \`productId\` varchar(255) NOT NULL,
        \`content\` text NOT NULL,
        \`usedSlots\` int NOT NULL DEFAULT 0,
        \`maxSlots\` int NOT NULL DEFAULT 1,
        \`createdAt\` timestamp DEFAULT (now()),
        \`updatedAt\` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT \`stock_items_id\` PRIMARY KEY(\`id\`)
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`stock_deliveries\` (
        \`id\` varchar(255) NOT NULL,
        \`orderId\` varchar(255) NOT NULL,
        \`stockItemId\` varchar(255) NOT NULL,
        \`deliveredAt\` timestamp DEFAULT (now()),
        CONSTRAINT \`stock_deliveries_id\` PRIMARY KEY(\`id\`)
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS \`stock_audit_logs\` (
        \`id\` varchar(255) NOT NULL,
        \`adminId\` varchar(255) NOT NULL,
        \`orderId\` varchar(255) NOT NULL,
        \`stockItemId\` varchar(255) NOT NULL,
        \`action\` enum('DELIVERY_ADDED','DELIVERY_REMOVED') NOT NULL,
        \`details\` text,
        \`createdAt\` timestamp DEFAULT (now()),
        CONSTRAINT \`stock_audit_logs_id\` PRIMARY KEY(\`id\`)
      );
    `);

    // Add FKs if they don't exist
    // MySQL handles this safely by ignoring if we check or use a stored procedure, but here we can just ignore errors
  } catch (e) {
    console.log("Error creating tables:", e);
  }

  console.log("Migrations done.");
  process.exit(0);
}

main();
