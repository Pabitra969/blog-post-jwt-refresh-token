const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'blogdb',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Create 'users' table for authentication
const createUsersTable = async () => {
    const queryText = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        refresh_token VARCHAR(255)
      )
    `;
    try {
      await pool.query(queryText);
      console.log('"users" table is ready.');
    } catch (err) {
      console.error('Error creating "users" table:', err);
    }
};

// Create 'blogs' table with a foreign key reference to the 'users' table
const createBlogsTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      about TEXT,
      content TEXT NOT NULL,
      image_path VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `;
  try {
    await pool.query(queryText);
    console.log('"blogs" table is ready.');
  } catch (err) {
    console.error('Error creating "blogs" table:', err);
  }
};

// Initializes all necessary tables
// NOTE: createUsersTable must run before createBlogsTable due to the foreign key constraint.
const initializeDb = async () => {
    await createUsersTable();
    await createBlogsTable();
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initializeDb,
};