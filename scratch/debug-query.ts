import { db } from "../db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Debugging affiliates query...");
  try {
    const userId = "466a6942-84db-4c89-89bc-0776ccf84d16";
    const res = await db.execute(sql`
      SELECT id, userId, handle, commissionRate, balance, totalEarned, createdAt 
      FROM affiliates 
      WHERE userId = ${userId} 
      LIMIT 1
    `);
    console.log("Query Success:", res);
  } catch (error) {
    console.error("Query Failed Detail:", error);
  }
  process.exit(0);
}

main();
