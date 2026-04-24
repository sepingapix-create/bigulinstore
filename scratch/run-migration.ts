import { db } from "../db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Running migration to create withdrawals table...");
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id varchar(255) NOT NULL,
        affiliateId varchar(255) NOT NULL,
        amount decimal(10,2) NOT NULL,
        pixKey varchar(255) NOT NULL,
        pixKeyType varchar(50) NOT NULL,
        status enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
        adminNotes text,
        createdAt timestamp DEFAULT (now()),
        updatedAt timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT withdrawals_affiliateId_affiliates_id_fk FOREIGN KEY (affiliateId) REFERENCES affiliates (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
  process.exit(0);
}

main();
