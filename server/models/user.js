const {query} = require('../config/db');

const User = {};

// Function to create a new user
User.create = async (name, email, password) => {
  const result = await query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, password]
  );
  return result.rows[0];
}

// Function to find a user by email
User.findByEmail = async (email) => {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

// Function to find a user by ID
User.findById = async (id) => {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

// Function to update a user's refresh token
User.updateRefreshToken = async (id, refreshToken) => {
  await query(
    'UPDATE users SET refresh_token = $1 WHERE id = $2',
    [refreshToken, id]
  );
};

// Function to find a user by their refresh token
User.findByRefreshToken = async (refreshToken) => {
  const result = await query(
    'SELECT * FROM users WHERE refresh_token = $1',
    [refreshToken]
  );
  return result.rows[0];
};

// Function to clear a refresh token from the DB by the token value
User.clearRefreshTokenByToken = async (refreshToken) => {
  await query(
    'UPDATE users SET refresh_token = NULL WHERE refresh_token = $1',
    [refreshToken]
  );
};

module.exports = User;