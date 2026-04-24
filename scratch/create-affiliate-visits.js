// Script to create the affiliateVisits table directly
const { createConnection } = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function main() {
  const connection = await createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('Creating affiliateVisits table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`affiliateVisits\` (
        \`id\` varchar(255) NOT NULL,
        \`affiliateId\` varchar(255) NOT NULL,
        \`visitorIp\` varchar(100) DEFAULT NULL,
        \`userAgent\` text DEFAULT NULL,
        \`referrerUrl\` varchar(500) DEFAULT NULL,
        \`convertedToUser\` boolean DEFAULT false,
        \`convertedToSale\` boolean DEFAULT false,
        \`userId\` varchar(255) DEFAULT NULL,
        \`createdAt\` timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`affiliateVisits_affiliateId_fk\` FOREIGN KEY (\`affiliateId\`) REFERENCES \`affiliates\` (\`id\`)
      )
    `);
    console.log('✅ affiliateVisits table created successfully!');
  } catch (error) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('✅ Table already exists, skipping.');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await connection.end();
  }
}

main();
