const { pool, initializeDatabase } = require('./db/index');
const dotenv = require('dotenv');

dotenv.config();

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    // Log database info securely
    if (process.env.DATABASE_URL) {
      console.log(`Using connection string: ${process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
    } else {
      console.log(`Using database: ${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE} (user: ${process.env.PGUSER})`);
    }
    
    // Test connection
    const client = await pool.connect();
    console.log('Database connection successful!');
    
    // Initialize database
    console.log('Initializing database schema...');
    await initializeDatabase();
    console.log('Database schema created successfully!');
    
    // Test a simple query
    const result = await pool.query('SELECT current_timestamp as time');
    console.log(`Database server time: ${result.rows[0].time}`);
    
    // Check if schema exists
    const schemaResult = await pool.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'myschema'
    `);
    
    if (schemaResult.rows.length > 0) {
      console.log('Schema "myschema" exists');
      
      // Check if tables exist
      const tablesResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'myschema'
      `);
      
      console.log('Tables in myschema:');
      tablesResult.rows.forEach(row => {
        console.log(` - ${row.table_name}`);
      });
    } else {
      console.log('Schema "myschema" does not exist');
    }
    
    client.release();
    console.log('Database test completed successfully!');
    return true;
  } catch (error) {
    console.error('Database connection test failed:');
    console.error(error);
    return false;
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the test
testDatabaseConnection()
  .then(success => {
    if (success) {
      console.log('✓ Your database is correctly configured and ready to use');
      process.exit(0);
    } else {
      console.log('✗ Database configuration needs to be fixed');
      process.exit(1);
    }
  });
