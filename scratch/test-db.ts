import { db } from "../db/index";
import { products } from "../db/schema";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

async function test() {
  try {
    const result = await db.select().from(products).limit(1);
    console.log("Success:", result);
  } catch (error: any) {
    console.error("Actual DB Error:", error);
    if (error.sql) {
        console.error("SQL attempted:", error.sql);
    }
  }
  process.exit(0);
}

test();
