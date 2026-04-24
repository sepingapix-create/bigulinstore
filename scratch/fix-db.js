const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function fix() {
  console.log("Connecting to:", process.env.DATABASE_URL);
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log("Adding columns to products table...");
    await connection.query("ALTER TABLE products ADD COLUMN originalPrice DECIMAL(10,2)");
    await connection.query("ALTER TABLE products ADD COLUMN isFlashDeal TINYINT(1) DEFAULT 0");
    await connection.query("ALTER TABLE products ADD COLUMN flashDealEnd TIMESTAMP NULL");
    console.log("Columns added successfully!");
  } catch (err) {
    console.log("Error or columns already exist:", err.message);
  } finally {
    await connection.end();
  }
}

fix();
