import { db } from "../db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Checking active connections and limits...");
  try {
    const [rows] = await db.execute(sql`SHOW PROCESSLIST`);
    const processes = rows as unknown as any[];
    console.log("Active Connections:", processes.length);
    
    const [maxConn] = await db.execute(sql`SHOW VARIABLES LIKE 'max_connections'`);
    console.log("Max Connections Setting:", maxConn);
    
    console.log("Process List Detail:", rows);
  } catch (error) {
    console.error("Failed to check connections:", error);
  }
  process.exit(0);
}

main();
