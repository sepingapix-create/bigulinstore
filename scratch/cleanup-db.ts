import { db } from "../db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Cleaning up sleeping connections...");
  try {
    const [rows] = await db.execute(sql`SHOW PROCESSLIST`);
    const processes = rows as unknown as any[];
    
    for (const p of processes) {
      if (p.Command === 'Sleep' && p.Time > 10) {
        console.log(`Killing process ${p.Id} (Slept for ${p.Time}s)`);
        try {
          await db.execute(sql`KILL ${sql.raw(p.Id.toString())}`);
        } catch (e) {
          console.error(`Failed to kill ${p.Id}:`, e);
        }
      }
    }
    console.log("Cleanup finished.");
  } catch (error) {
    console.error("Failed to cleanup:", error);
  }
  process.exit(0);
}

main();
