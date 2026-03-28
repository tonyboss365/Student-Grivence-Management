import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import { existsSync, writeFileSync } from 'fs';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- High-Availability Persistent Storage Path ---
const RENDER_DISK_PATH = '/opt/render/project/src/data';
const DATA_DIR = existsSync(RENDER_DISK_PATH) ? RENDER_DISK_PATH : __dirname;
const DB_FILE = path.join(DATA_DIR, 'database.sqlite');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// --- SQLite Zero-Config Database initialization ---
let sqliteDb: Database;

async function initSqlite() {
  sqliteDb = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  // Create core tables
  await sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('student', 'staff', 'admin')) NOT NULL,
      department_id INTEGER,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );

    CREATE TABLE IF NOT EXISTS grievances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT NOT NULL UNIQUE,
      student_id INTEGER NOT NULL,
      department_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      contact_email TEXT,
      contact_phone TEXT,
      is_anonymous BOOLEAN DEFAULT 0,
      status TEXT CHECK(status IN ('pending', 'in_progress', 'resolved', 'closed')) DEFAULT 'pending',
      student_rating INTEGER,
      student_feedback TEXT,
      resolution_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );

    CREATE TABLE IF NOT EXISTS grievance_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grievance_id INTEGER NOT NULL,
      status_from TEXT,
      status_to TEXT NOT NULL,
      changed_by INTEGER NOT NULL,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (grievance_id) REFERENCES grievances(id),
      FOREIGN KEY (changed_by) REFERENCES users(id)
    );
  `);

  // Seed default data if empty
  const deptsCount: any = await sqliteDb.get('SELECT COUNT(*) as count FROM departments');
  if (deptsCount.count === 0) {
    await sqliteDb.run('INSERT INTO departments (name) VALUES (?), (?), (?), (?)', ['Academic', 'Hostel', 'Infrastructure', 'Finance']);
    const hashed = bcrypt.hashSync('staff123', 10);
    await sqliteDb.run('INSERT INTO users (name, email, password, role, department_id) VALUES (?, ?, ?, ?, ?)', ['Staff User', 'staff@example.com', hashed, 'staff', 1]);
    const studentHashed = bcrypt.hashSync('student123', 10);
    await sqliteDb.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['Student User', 'student@example.com', studentHashed, 'student']);
  }
}

// --- Safemode Database Proxy (Now redirected to SQLite for 100% success) ---
const db = {
  async query(sql: string, params: any[] = []): Promise<[any, any]> {
    // Convert MySQL style '?' to SQLite style (they match usually)
    // We use sqliteDb.all for SELECT and run for others
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
    
    try {
      if (isSelect) {
        const rows = await sqliteDb.all(sql, params);
        return [rows, null];
      } else {
        const result = await sqliteDb.run(sql, params);
        return [{ insertId: result.lastID, affectedRows: result.changes }, null];
      }
    } catch (err: any) {
      console.error('SQLite Error:', err);
      throw err;
    }
  }
};

// --- Start Express Server ---
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(express.json());

  // Database Connection Safety Middleware
  app.use('/api', (req, res, next) => {
    if (!sqliteDb) {
      return res.status(503).json({ 
        error: 'Database is still initializing. Please refresh in a moment.' 
      });
    }
    next();
  });

  // Zero-Config Cloud/Local Initialization
  initSqlite()
    .then(() => console.log('SQLite Database initialized successfully (Zero-Config mode).'))
    .catch(err => {
      console.error('CRITICAL: DATABASE INITIALIZATION FAILED:', err);
    });

  // --- API Routes ---

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const [rows]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = rows[0];
      
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, role: user.role, name: user.name, department_id: user.department_id }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Register
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hash = bcrypt.hashSync(password, 10);
      
      const [result]: any = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hash, 'student']
      );
      
      const token = jwt.sign(
        { id: result.insertId, role: 'student', name, department_id: null }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      res.status(201).json({ 
        token, 
        user: { id: result.insertId, name, email, role: 'student' } 
      });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // Get current user
  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    try {
      const [rows]: any = await db.query(
        'SELECT id, name, email, role, department_id FROM users WHERE id = ?',
        [req.user.id]
      );
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get Departments
  app.get('/api/departments', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM departments');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get Grievances
  app.get('/api/grievances', authenticateToken, async (req: any, res) => {
    try {
      let query = `
        SELECT g.*, 
               u.name as student_name, 
               d.name as department_name
        FROM grievances g
        LEFT JOIN users u ON g.student_id = u.id
        LEFT JOIN departments d ON g.department_id = d.id
      `;
      
      const queryParams: any[] = [];
      
      if (req.user.role === 'student') {
        query += ` WHERE g.student_id = ?`;
        queryParams.push(req.user.id);
      } // else if (req.user.role === 'staff') {
        // query += ` WHERE g.department_id = ?`;
        // queryParams.push(req.user.department_id);
      // }
      
      query += ' ORDER BY g.created_at DESC';
      
      const [rows] = await db.query(query, queryParams);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get Dashboard Stats
  app.get('/api/stats', authenticateToken, async (req: any, res) => {
    try {
      let baseWhere = '1=1';
      const queryParams: any[] = [];
      
      if (req.user.role === 'student') {
        baseWhere = 'student_id = ?';
        queryParams.push(req.user.id);
      } // else if (req.user.role === 'staff') {
        // baseWhere = 'department_id = ?';
        // queryParams.push(req.user.department_id);
      // }

      const [totalResult]: any = await db.query(`SELECT COUNT(*) as count FROM grievances WHERE ${baseWhere}`, queryParams);
      const [resolvedResult]: any = await db.query(`SELECT COUNT(*) as count FROM grievances WHERE status = 'resolved' AND ${baseWhere}`, queryParams);
      const [pendingResult]: any = await db.query(`SELECT COUNT(*) as count FROM grievances WHERE status = 'pending' AND ${baseWhere}`, queryParams);
      const [inProgressResult]: any = await db.query(`SELECT COUNT(*) as count FROM grievances WHERE status = 'in_progress' AND ${baseWhere}`, queryParams);

      // Advanced Metrics
      const [avgRatingResult]: any = await db.query(`
        SELECT AVG(student_rating) as avg_rating 
        FROM grievances 
        WHERE student_rating IS NOT NULL AND ${baseWhere}
      `, queryParams);

      const [avgTimeResult]: any = await db.query(`
        SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) as avg_hours 
        FROM grievances 
        WHERE status = 'resolved' AND ${baseWhere}
      `, queryParams);

      res.json({
        total: totalResult[0].count,
        resolved: resolvedResult[0].count,
        pending: pendingResult[0].count,
        inProgress: inProgressResult[0].count,
        avgRating: avgRatingResult[0].avg_rating || 0,
        avgResolutionHours: avgTimeResult[0].avg_hours || 0
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Submit Grievance
  app.post('/api/grievances', authenticateToken, async (req: any, res) => {
    try {
      const { department_id, category, title, description, contact_email, contact_phone, is_anonymous } = req.body;
      const ticket_id = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
      
      const [result]: any = await db.query(`
        INSERT INTO grievances (ticket_id, student_id, department_id, category, title, description, contact_email, contact_phone, is_anonymous)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [ticket_id, req.user.id, department_id, category, title, description, contact_email, contact_phone, is_anonymous ? 1 : 0]);
      
      const grievanceId = result.insertId;

      // Create initial log
      await db.query(`
        INSERT INTO grievance_logs (grievance_id, status_from, status_to, changed_by, note)
        VALUES (?, ?, ?, ?, ?)
      `, [grievanceId, null, 'pending', req.user.id, 'Grievance submitted by student']);

      res.status(201).json({ id: grievanceId, ticket_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update Grievance Status
  app.put('/api/grievances/:id/status', authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role === 'student') return res.sendStatus(403);
      
      const { status, note } = req.body;
      const grievanceId = req.params.id;

      // Get current status for logging
      const [current]: any = await db.query('SELECT status FROM grievances WHERE id = ?', [grievanceId]);
      const oldStatus = current[0]?.status;

      // Update grievance
      await db.query(
        'UPDATE grievances SET status = ?, resolution_note = ? WHERE id = ?', 
        [status, note || null, grievanceId]
      );

      // Log the change
      await db.query(
        'INSERT INTO grievance_logs (grievance_id, status_from, status_to, changed_by, note) VALUES (?, ?, ?, ?, ?)',
        [grievanceId, oldStatus, status, req.user.id, note || null]
      );

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Submit Feedback (Student)
  app.post('/api/grievances/:id/feedback', authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== 'student') return res.sendStatus(403);
      
      const { rating, feedback } = req.body;
      const grievanceId = req.params.id;

      // Ensure student owns this grievance
      const [check]: any = await db.query('SELECT student_id FROM grievances WHERE id = ?', [grievanceId]);
      if (!check[0] || check[0].student_id !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await db.query(
        'UPDATE grievances SET student_rating = ?, student_feedback = ? WHERE id = ?',
        [rating, feedback, grievanceId]
      );

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get Dashboard Stats (Shorthand for Dashboards)
  app.get('/api/stats', authenticateToken, async (req: any, res) => {
    try {
      const [avgRating]: any = await db.query('SELECT AVG(student_rating) as avgRating FROM grievances WHERE student_rating IS NOT NULL');
      
      // Calculate avg resolution time in hours
      const [avgRes]: any = await db.query(`
        SELECT AVG(TIMESTAMPDIFF(HOUR, g.created_at, l.created_at)) as avgHours
        FROM grievances g
        JOIN grievance_logs l ON g.id = l.grievance_id
        WHERE l.status_to = 'resolved'
      `);

      res.json({
        avgRating: parseFloat(avgRating[0].avgRating || 0),
        avgResolutionHours: parseFloat(avgRes[0].avgHours || 0)
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get System Analytics
  app.get('/api/analytics', authenticateToken, async (req: any, res) => {
    try {
      const [total]: any = await db.query('SELECT COUNT(*) as count FROM grievances');
      const [statusCounts]: any = await db.query('SELECT status, COUNT(*) as count FROM grievances GROUP BY status');
      const [deptCounts]: any = await db.query(`
        SELECT d.name, COUNT(g.id) as count 
        FROM departments d 
        LEFT JOIN grievances g ON d.id = g.department_id 
        GROUP BY d.id
      `);
      const [avgRating]: any = await db.query('SELECT AVG(student_rating) as avg FROM grievances WHERE student_rating IS NOT NULL');

      res.json({
        total: total[0].count,
        statusBreakdown: statusCounts,
        departmentBreakdown: deptCounts,
        averageRating: parseFloat(avgRating[0].avg || 0).toFixed(1)
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update User Settings
  app.put('/api/auth/settings', authenticateToken, async (req: any, res) => {
    try {
      const { name, email, password } = req.body;
      let query = 'UPDATE users SET name = ?, email = ?';
      let params = [name, email];

      if (password) {
        const hash = bcrypt.hashSync(password, 10);
        query += ', password = ?';
        params.push(hash);
      }

      query += ' WHERE id = ?';
      params.push(req.user.id);

      await db.query(query, params);
      res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // Get Grievance Details (including Logs)
  app.get('/api/grievances/:id', authenticateToken, async (req: any, res) => {
    try {
      const [grievance]: any = await db.query(`
        SELECT g.*, u.name as student_name, d.name as department_name 
        FROM grievances g 
        LEFT JOIN users u ON g.student_id = u.id 
        LEFT JOIN departments d ON g.department_id = d.id 
        WHERE g.id = ?
      `, [req.params.id]);

      if (!grievance[0]) return res.status(404).json({ error: 'Not found' });

      // Enforce student ownership
      if (req.user.role === 'student' && grievance[0].student_id !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const [logs] = await db.query(`
        SELECT l.*, u.name as user_name 
        FROM grievance_logs l 
        JOIN users u ON l.changed_by = u.id 
        WHERE l.grievance_id = ? 
        ORDER BY l.created_at ASC
      `, [req.params.id]);

      res.json({ ...grievance[0], logs });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

export default await startServer();
