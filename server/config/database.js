const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ctechlit_db',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  timezone: '+00:00',
  ssl: false
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`📊 Connected to MySQL database: ${dbConfig.database}`);
    console.log(`🔗 Host: ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Execute query with error handling
const executeQuery = async (query, params = []) => {
  try {
    const [rows, fields] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get connection from pool
const getConnection = async () => {
  return await pool.getConnection();
};

// Release connection back to pool
const releaseConnection = (connection) => {
  if (connection) {
    connection.release();
  }
};

// Start transaction
const startTransaction = async () => {
  const connection = await getConnection();
  await connection.beginTransaction();
  return connection;
};

// Commit transaction
const commitTransaction = async (connection) => {
  await connection.commit();
  releaseConnection(connection);
};

// Rollback transaction
const rollbackTransaction = async (connection) => {
  await connection.rollback();
  releaseConnection(connection);
};

// Close pool
const closePool = async () => {
  await pool.end();
  console.log('Database connection pool closed');
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  getConnection,
  releaseConnection,
  startTransaction,
  commitTransaction,
  rollbackTransaction,
  closePool
};