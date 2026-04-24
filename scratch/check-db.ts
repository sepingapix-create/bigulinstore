import { db } from "../db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Checking table structures...");
  try {
    const [affiliatesInfo] = await db.execute(sql`DESCRIBE affiliates`);
    console.log("Affiliates Table:", affiliatesInfo);
    
    const [withdrawalsInfo] = await db.execute(sql`DESCRIBE withdrawals`);
    console.log("Withdrawals Table:", withdrawalsInfo);
  } catch (error) {
    console.error("Check failed:", error);
  }
  process.exit(0);
}

main();
