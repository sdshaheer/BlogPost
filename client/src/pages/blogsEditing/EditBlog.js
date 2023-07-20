import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoAddCircle } from "react-icons/io5";
import MarkDown from "../blogsCreation/MarkDown";
import classes from "./editBlog.module.css";

const EditBlog = () => {
  const { id: blogId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    const saveImage = async () => {
      try {
        const data = new FormData();
        data.append("image", file);
        const res = await axios.post("/single", data);
        setInputs({ ...inputs, image: res.data.imageUrl });
      } catch (error) {
        console.log(error);
      }
    };
    saveImage();
  }, [file]);

  const fetchBlogDetails = async () => {
    try {
      const { data } = await axios.get(`/api/v1/blogs/get-blog/${blogId}`, {
        headers: {
          Authorization: sessionStorage.getItem("accessToken"),
        },
      });
      console.log(data);
      setInputs({
        title: data.blog.title,
        description: data.blog.description,
        image: data.blog.image,
        category: data.blog.category,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchBlogDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/blogs/update-blog/${blogId}`,
        {
          title: inputs.title,
          description: inputs.description,
          image: inputs.image,
          category: inputs.category,
        },
        {
          headers: {
            Authorization: sessionStorage.getItem("accessToken"),
          },
        }
      );
      if (data?.success) {
        console.log("blog created successfully");
        navigate("/home/AllBlogs");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="container">
      <div className={classes.imageContainer}>
        <img className={classes.imageHeader} src={inputs.image} />
      </div>
      <div className={classes.createBlog}>
        <form className={`d-flex flex-column ${classes.form}`}>
          <div className="d-flex">
            <label htmlFor="fileInput">
              <IoAddCircle size="25" />
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".jpeg, .png, .jpg"
              onChange={handleUploadFile}
              style={{ display: "none" }}
            />
            <input
              type="text"
              id="title"
              value={inputs.title}
              className={classes.title}
              placeholder="Add a Title"
              onChange={handleChange}
            />
          </div>
          <div className="d-flex">
            <div className="d-flex flex-column w-100 mt-4">
              <span className="text-center font-weight-bold">
                Tell you story ...
              </span>
              <textarea
                className={classes.textarea}
                id="description"
                value={inputs.description}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex flex-column w-100 m-2 mt-4 overflow-auto">
              <span className="text-center font-weight-bold">Preview !</span>
              <MarkDown>{inputs.description}</MarkDown>
            </div>
          </div>
        </form>
        <button onClick={handleSubmit} className={classes.publishButton}>
          Update
        </button>
      </div>
    </div>
  );
};

export default EditBlog;
