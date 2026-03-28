import mysql from 'mysql2/promise';

async function checkDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'P@ssw0rd',
    database: 'grievance_db'
  });

  console.log('\n--- USERS IN DATABASE ---');
  const [users] = await connection.query('SELECT id, name, email, role FROM users');
  console.table(users);

  console.log('\n--- GRIEVANCES IN DATABASE ---');
  const [grievances] = await connection.query('SELECT id, ticket_id, title, student_id, status, category FROM grievances');
  console.table(grievances);

  await connection.end();
}

checkDatabase().catch(err => {
  console.error('Error connecting to database:', err.message);
});
