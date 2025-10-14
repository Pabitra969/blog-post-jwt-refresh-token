const {query} = require('../config/db');

const Blog = {};

Blog.fetchAll = async (limit, offset) => {
  const result = await query('SELECT blogs.id, blogs.title, blogs.description, blogs.about, blogs.content, blogs.image_path, blogs.created_at, users.name FROM blogs JOIN users ON blogs.user_id = users.id ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
  return result.rows;
}

Blog.create = async (title, description, about, content, image_path, user_id) => {
  const result = await query(
    'INSERT INTO blogs (title, description, about, content, image_path, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, description, about, content, image_path, user_id]
  )
  return result.rows[0];
}

Blog.fetchByUserID = async (user_id) => {
  const result = await query(
    'SELECT blogs.id, blogs.title, blogs.description, blogs.about, blogs.content, blogs.image_path, blogs.created_at, users.name FROM blogs JOIN users ON blogs.user_id = users.id WHERE user_id = $1',
    [user_id]
  )
  return result.rows;
}

Blog.findById = async (id) => {
  const result = await query(
    'SELECT * FROM blogs WHERE id = $1',
    [id]
  );
  return result.rows[0];
};



Blog.update = async (id, { title, description, about, content, image_path }) => {
  const result = await query(
    'UPDATE blogs SET title = $1, description = $2, about = $3, content = $4, image_path = $5 WHERE id = $6 RETURNING *',
    [title, description, about, content, image_path, id]
  );
  return result.rows[0];
};

Blog.delete = async (id) => {
  await query('DELETE FROM blogs WHERE id = $1', [id]);
};

Blog.countAll = async () => {
  const result = await query('SELECT COUNT(*) FROM blogs');
  return parseInt(result.rows[0].count, 10);
};

module.exports = Blog;