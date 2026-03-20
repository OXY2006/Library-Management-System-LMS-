const { pool, query } = require('../config/db');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing database schema...\n');
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully!\n');
    console.log('Tables created:');
    console.log('  • users');
    console.log('  • books');
    console.log('  • members');
    console.log('  • transactions');
    console.log('  • reviews');
    console.log('  • recommendations');
    console.log('  • analytics_log');
    console.log('\nRun "npm run seed" to populate with sample data.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
