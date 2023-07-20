const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title : {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    category:{
      type:String,
      required:true
    },
    likes:{
      type:Array,
      default:[]
    },
    comments:{
      type:Array,
      default:[]
    },
    user:{
      type:mongoose.Types.ObjectId,
      ref:'User',
      required:true
    }
  },
  { timestamps: true }
);

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
