import mysql from 'mysql2/promise';

async function cleanMockData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'P@ssw0rd',
    database: 'grievance_db'
  });

  console.log('Cleaning up mock data...');
  
  // Delete grievances that start with 'TKT-100' or similar pattern used in mocks
  const [result] = await connection.query(`
    DELETE FROM grievances 
    WHERE ticket_id LIKE 'TKT-10%' 
       OR title = 'VERIFY CARD'
       OR title LIKE '%Mock%'
  `);

  console.log(`Successfully deleted ${result.affectedRows} mock records.`);
  await connection.end();
}

cleanMockData().catch(err => {
  console.error('Error cleaning database:', err.message);
});
