import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoAddCircle } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { modalActions } from "../../reduxStore/ModalStore";
import MyModal from "../../Modals/MyModal";
import Spinner from "../../Modals/Spinner";
import MarkDown from "./MarkDown";
import classes from "./createBlog.module.css";

const CreateBlog = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.modal.isLoading);
  const loadModal = useSelector((state) => state.modal.loadModal);
  const loadModalMessage = useSelector((state) => state.modal.loadModalMessage);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    "https://www.bbvaapimarket.com/wp-content/uploads/2018/04/blogsapis.jpg"
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
  });

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    const saveImage = async () => {
      if (file == null) return;
      try {
        dispatch(modalActions.setIsLoading(true)); // dispatch
        const data = new FormData();
        data.append("image", file);
        const res = await axios.post("/single", data);
        dispatch(modalActions.setIsLoading(false)); // dispatch
        setImageUrl(res.data.imageUrl);
        //console.log(res.data.imageUrl);
      } catch (error) {
        dispatch(modalActions.setIsLoading(false)); // dispatch
        dispatch(modalActions.setLoadModal(true)); // dispatch
        dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch

        console.log(error);
      }
    };
    saveImage();
  }, [file]);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const data = {
    //   title: inputs.title,
    //   description: inputs.description,
    //   image: imageUrl,
    //   category: searchParams.get("category"),
    // };
    // console.log(data);
    try {
      dispatch(modalActions.setIsLoading(true)); // dispatch
      const { data } = await axios.post(
        "/api/v1/blogs/create-blog",
        {
          title: inputs.title,
          description: inputs.description,
          image: imageUrl,
          category: searchParams.get("category"),
        },
        {
          headers: {
            Authorization: sessionStorage.getItem("accessToken"),
          },
        }
      );
      if (data?.success) {
        dispatch(modalActions.setIsLoading(false)); // dispatch
        console.log("blog created successfully");
        navigate("/home");
      }
    } catch (error) {
      dispatch(modalActions.setIsLoading(false)); // dispatch
      dispatch(modalActions.setLoadModal(true)); // dispatch
      dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch
    }
  };

  return (
    <div className="container">
      <div className={classes.imageContainer}>
        <img className={classes.imageHeader} src={imageUrl} />
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
              className={classes.title}
              placeholder="Add a Title"
              onChange={handleChange}
            />
          </div>
          <div className="d-flex">
            <div className="d-flex flex-column w-100 mt-4 ">
              <span className="text-center font-weight-bold">
                Tell you story ...
              </span>
              <textarea
                autoFocus
                className={classes.textarea}
                id="description"
                onChange={handleChange}
                rows="10"
                cols="20"
              />
            </div>
            <div className="d-flex flex-column w-100 m-2 mt-4 overflow-auto">
              <span className="text-center font-weight-bold">Preview !</span>
              <MarkDown>{inputs.description}</MarkDown>
            </div>
          </div>
        </form>
        <button onClick={handleSubmit} className={classes.publishButton}>
          Publish
        </button>
      </div>

      {isLoading && <Spinner />}
      <MyModal
        show={loadModal}
        hide={() => dispatch(modalActions.setLoadModal(false))}
        message={loadModalMessage}
      />
    </div>
  );
};

export default CreateBlog;
