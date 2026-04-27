import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
// dotenv.config(); // Next.js handles this automatically

const dbUrlString = process.env.DATABASE_URL || "mysql://user:pass@localhost:3306/db";
let dbUrl: URL;
try {
  dbUrl = new URL(dbUrlString);
} catch (e) {
  dbUrl = new URL("mysql://user:pass@localhost:3306/db");
}

const connectionConfig = {
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  port: parseInt(dbUrl.port) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
};

declare global {
  var pool: mysql.Pool | undefined;
}

const poolConnection = global.pool || mysql.createPool(connectionConfig);

if (process.env.NODE_ENV !== "production") {
  global.pool = poolConnection;
}

export const db = drizzle(poolConnection, { schema, mode: "default" });
