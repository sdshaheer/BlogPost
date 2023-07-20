const mongoose = require("mongoose");
const blogModel = require("../DataBase/Models/blogModel");
const userModel = require("../DataBase/Models/userModel");

// creates blog
exports.createBlogController = async (req, res) => {
  try {
    const { title, description, image, category } = req.body;

    if (!title || !description || !image || !category) {
      return res.status(400).send({
        message: "Please provide all fields",
        success: false,
      });
    }

    // creating a new blog
    const newBlog = new blogModel({
      title,
      description,
      image,
      category,
      user: req.userId,
    });
    await newBlog.save();

    // addding post to user
    const blogOwner = await userModel.findById(req.userId);
    await blogOwner.updateOne({ $push: { blogs: newBlog._id } });

    return res.status(200).send({
      message: "Blog created successfully",
      success: true,
      newBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error while creating the Blog",
      success: false,
      error,
    });
  }
};

// return all blogs
exports.getAllBlogsController = async (req, res) => {
  try {
    const {limit,skip} = req.query
    const limitNum = parseInt(limit)
    const skipNum = parseInt(skip)
    const totalBlogs = await blogModel.find({})
    const blogs = await blogModel.find({}).populate("user").limit(limitNum).skip(skipNum);
    console.log(totalBlogs.length)
    if (!blogs) {
      return res.status(200).send({
        message: "No blogs Found",
        success: false,
      });
    }

    return res.status(200).send({
      message: "All blogs lists",
      success: true,
      blogsCount: totalBlogs.length,
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error while getting all the Blogs",
      success: false,
      error,
    });
  }
};

// updates the blog
exports.updateBlogController = async (req, res) => {
  console.log("hello");
  try {
    const { id } = req.params;
    console.log("......", req.body, id);
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      message: "Blog updated successfully",
      success: true,
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error while updating the Blog",
      success: false,
      error,
    });
  }
};

// return single blog by id
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id).populate("user");
    const isOwner = req.userId == blog.user._id;
    if (!blog) {
      return res.status(404).send({
        message: "No blog found with this id",
        success: false,
      });
    }
    return res.status(200).send({
      message: "The blog was found",
      success: true,
      isOwner,
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error while getting the single Blog by Id",
      success: false,
      error,
    });
  }
};

// delete the blog
exports.deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findByIdAndDelete(id).populate("user");
    console.log(blog);
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      message: "The blog was deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error while deleting the Blog",
      success: false,
      error,
    });
  }
};

// get user blogs
exports.userBlogController = async (req, res) => {
  try {
    const {limit,skip} = req.query
    const limitNum = parseInt(limit)
    const skipNum = parseInt(skip)
    const totalUserBlogs = await blogModel.find({user:req.userId})
    const blogs = await blogModel.find({user:req.userId}).limit(limitNum).skip(skipNum);
    console.log('....................')
    console.log(blogs)
    if (!blogs) {
      console.log('hello')
      return res.status(404).send({
        message: "No blogs found for this user",
        success: false,
      });
    }
    console.log('.......')
    return res.status(200).send({
      message: "user blogs found successfully",
      success: true,
      blogsCount:totalUserBlogs.length,
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error in user blog",
      success: false,
      error,
    });
  }
};

// get blogs by categories
exports.categoryBlogController = async (req, res) => {
  console.log("categories");
  try {
    const {limit,skip} = req.query
    const limitNum = parseInt(limit)
    const skipNum = parseInt(skip)
    const totalBlogs = await blogModel.find({ category: req.params.category });
    const blogs = await blogModel.find({ category: req.params.category }).limit(limitNum).skip(skipNum);
    if (!blogs) {
      return res.status(404).send({
        message: "No blogs found in this category",
        success: false,
      });
    }
    return res.status(200).send({
      message: "blogs found successfully catregory wise",
      success: true,
      blogsCount:totalBlogs.length,
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error in fetching blogs by category wise",
      success: false,
      error,
    });
  }
};

// comments
exports.commentBlogController = async (req, res) => {
  console.log("hello");
  try {
    const blog = await blogModel.findById(req.params.id);
    const user = await userModel.findById(req.userId);
    await blog.updateOne({
      $push: {
        comments: {
          commentedUserId: req.userId,
          commentedUserName: user.username,
          message: req.body.message,
          commentedAt: new Date(),
        },
      },
    });

    return res.status(200).send({
      message: "blogs commented successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error in commenting the blog",
      success: false,
      error,
    });
  }
};

// like a post
exports.likeBlogController = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    const user = await userModel.findById(req.userId);
    if (!blog.likes.includes(req.userId)) {
      await blog.updateOne({
        $push: { likes: req.userId },
      });
      return res.status(200).send({
        message: "you liked the post",
        success: true,
      });
    } else {
      await blog.updateOne({ $pull:{likes:req.userId} });
      return res.status(200).send({
        message: "you disliked the post",
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Error while liking post",
      success: false,
      error,
    });
  }
};
