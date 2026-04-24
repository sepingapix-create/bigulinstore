import { db } from "../db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Debugging getWithdrawalsAction query...");
  try {
    const results = await db.query.withdrawals.findMany({
      with: {
        affiliate: {
          with: {
            user: true
          }
        }
      },
    });
    console.log("Query Results:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Query Failed:", error);
  }
  process.exit(0);
}

main();
