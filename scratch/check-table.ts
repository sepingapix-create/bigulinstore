import { db } from "../db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  try {
    const [res] = await db.execute(sql`SHOW CREATE TABLE products`);
    console.log(JSON.stringify(res, null, 2));
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}

main();
