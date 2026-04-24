import { db } from "../db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Checking withdrawals in DB...");
  try {
    const [rows] = await db.execute(sql`SELECT * FROM withdrawals`);
    const results = rows as unknown as any[];
    console.log("Total withdrawals:", results.length);
    console.log(rows);
  } catch (error) {
    console.error("Query failed:", error);
  }
  process.exit(0);
}

main();
