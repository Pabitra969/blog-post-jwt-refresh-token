const express = require('express');
const {createBlog, updateBlog, deleteBlog, getBlogById, fetchAllBlogs, fetchBlogByUserID} = require('../controllers/blogController');
const userMiddleware = require('../middleware/userMiddleware');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// router.get('/you', userMiddleware, fetchBlogByUserID);

router.get('/you', userMiddleware, fetchBlogByUserID);
router.get('/', fetchAllBlogs);
router.get('/:id', getBlogById);
router.post('/create', userMiddleware, upload.single('image'), createBlog);
router.put('/update/:id', userMiddleware, upload.single('image'),updateBlog);
router.delete('/delete/:id', userMiddleware, deleteBlog);

module.exports = router;