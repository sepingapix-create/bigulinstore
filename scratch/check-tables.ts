import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

async function check() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL as string);
  const [rows] = await connection.execute("SHOW TABLES");
  console.log("Tables:", rows);
  await connection.end();
}

check();
