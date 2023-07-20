const express = require("express");
const {
  createBlogController,
  getAllBlogsController,
  updateBlogController,
  getBlogByIdController,
  deleteBlogController,
  userBlogController,
  categoryBlogController,
  commentBlogController,
  likeBlogController
} = require("../controllers/blogController");
const authenticateToken = require('../controllers/jwtController')

const router = express.Router();


// create blog
router.post("/create-blog", authenticateToken, createBlogController);

// get all blogs
router.get("/all-blogs", getAllBlogsController);

// update blog
router.put("/update-blog/:id",authenticateToken, updateBlogController);

// get single blog
router.get("/get-blog/:id",authenticateToken, getBlogByIdController);

// delete blog
router.delete("/delete-blog/:id",authenticateToken, deleteBlogController);

// get user blogs
router.get("/user-blogs",authenticateToken,userBlogController)

// get blog by category
router.get("/categories/:category",categoryBlogController)

// comment a blog
router.put("/comment/:id",authenticateToken,commentBlogController)

// like a blog
router.put("/like/:id",authenticateToken,likeBlogController)


module.exports = router;
