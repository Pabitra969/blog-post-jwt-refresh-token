const Blog = require('../models/blogs');
const fs = require('fs');
const path = require('path');

const blogController = {};

blogController.createBlog = async (req, res) => {
  // console.log(req.body);

  const { title, description, about, content } = req.body;
  const image_path = req.file ? req.file.path : null;
  const user_id = req.user.id;

  try {
    if(!title || !description || !about || !content || !image_path) {
      return res.status(405).json({ message: 'Please provide all fields' });
    }
    const blog = await Blog.create(title, description, about, content, image_path, user_id);
    res.status(201).json({ message: 'Blog created successfully', blog });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error : error});
  }
}

blogController.updateBlog = async (req, res) => {
  try {
      const id = req.params.id;
    const {title, description, about, content} = req.body;
    const user_id = req.user.id;


    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    console.log( "blog " + existingBlog.user_id);
    console.log("user " + req.user.id);



    //check if the blog belongs to the user or not
    if(existingBlog.user_id !== user_id) {
      return res.status(403).json({ message: 'You are not authorized to update this blog' });
    }

    let image_path = existingBlog.image_path;
      if (req.file) {
        // Delete old image if it exists
        if (image_path) {
          const oldImagePath = path.join(__dirname, '..', image_path);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        image_path = 'uploads/' + req.file.filename;
      }

      const updatedBlog = await Blog.update(id, { title, description, about, content, image_path });
      res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error : error});
    console.log(error);
  }
}

blogController.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if the blog belongs to the user
    if (existingBlog.user_id !== user_id) {
      return res.status(403).json({ error: 'You are not authorized to delete this blog' });
    }

    // Delete image file if it exists
    if (existingBlog.image_path) {
      const imagePath = path.resolve(__dirname, '..', 'uploads', path.basename(existingBlog.image_path));

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Blog.delete(id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


blogController.fetchAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const blogs = await Blog.fetchAll(limit, offset);
    const totalBlogs = await Blog.countAll();
    const totalPages = Math.ceil(totalBlogs / limit);
    console.log(blogs);

    res.status(200).json({ blogs, totalPages });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error : error});
  }
}

blogController.fetchBlogByUserID = async (req, res) => {
  const user_id = req.user.id;

  try {
    const blogs = await Blog.fetchByUserID(user_id);
    console.log(blogs);
    res.status(200).json({ blogs });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error : error});
  }
}

blogController.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    res.status(200).json({ blog });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error : error});
  }
}



module.exports = blogController