const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./DataBase/db");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const multer = require("multer");
const path = require("path");

// env configuration
dotenv.config();

// connect to database
connectDB();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/images", express.static("images"));

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/blogs", blogRoutes);

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: imageStorage,
});

app.post("/single", upload.single("image"), (req, res) => {
  console.log(req.file);
  // Get the server's base URL
  const filename = req.file.filename;
  const filePath = req.file.path;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  // Construct the image URL
  const imageUrl = `${baseUrl}/images/${filename}`;
  console.log(imageUrl);

  return res.status(200).send({
    message: "parded",
    success: true,
    imageUrl
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
  
});

