import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const sslOption = process.env.DB_SSL === 'true' ? {
  rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
} : undefined;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  ...(sslOption && { ssl: sslOption }),
};

const dbName = process.env.DB_NAME || 'career_assistant';

let pool = null;

// Initialize database tables
export async function initDatabase() {
  // 1. Attempt to create database if permitted
  try {
    const connection = await mysql.createConnection(dbConfig);
    try {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      console.log(`✅ Database "${dbName}" verified/created`);
    } catch (error) {
      console.warn(`⚠️ Could not auto-create database (may be pre-created by cloud host):`, error.message);
    } finally {
      await connection.end();
    }
  } catch (err) {
    console.warn(`⚠️ Direct DB creation connection skipped:`, err.message);
  }

  // 2. Initialize connection pool with database specified
  pool = mysql.createPool({
    ...dbConfig,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // 3. Create tables
  const poolConn = await pool.getConnection();
  try {
    // Create analyses table
    await poolConn.query(`
      CREATE TABLE IF NOT EXISTS analyses (
        id VARCHAR(36) PRIMARY KEY,
        session_id VARCHAR(36) NOT NULL,
        job_title VARCHAR(255),
        company VARCHAR(255),
        compatibility_score INT,
        missing_skills JSON,
        weaknesses JSON,
        recommendations JSON,
        interview_questions JSON,
        cover_letter TEXT,
        cv_filename VARCHAR(255),
        skills TEXT,
        diplomas TEXT,
        job_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session (session_id)
      )
    `);

    // Create interviews table
    await poolConn.query(`
      CREATE TABLE IF NOT EXISTS interviews (
        id VARCHAR(36) PRIMARY KEY,
        analysis_id VARCHAR(36),
        session_id VARCHAR(36) NOT NULL,
        messages JSON,
        feedback JSON,
        status ENUM('active', 'completed') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE,
        INDEX idx_interview_session (session_id)
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Table initialization error:', error.message);
    throw error;
  } finally {
    poolConn.release();
  }
}

// Export object that mimics the pool interface
const db = {
  query: async (...args) => {
    if (!pool) {
      throw new Error('Database pool not initialized. Call initDatabase first.');
    }
    return pool.query(...args);
  },
  getConnection: async () => {
    if (!pool) {
      throw new Error('Database pool not initialized. Call initDatabase first.');
    }
    return pool.getConnection();
  }
};

export default db;

