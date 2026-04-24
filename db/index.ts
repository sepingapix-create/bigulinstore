import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const dbUrl = new URL(process.env.DATABASE_URL as string);

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
