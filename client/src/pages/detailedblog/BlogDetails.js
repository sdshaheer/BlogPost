import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdModeEdit, MdDelete } from "react-icons/md";
import classes from "./blogdetails.module.css";
import MarkDown from "../blogsCreation/MarkDown";
import { useNavigate } from "react-router-dom";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import Comment from "../blogComments/Comment";
import { modalActions } from "../../reduxStore/ModalStore";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import MyModal from "../../Modals/MyModal";
import Spinner from "../../Modals/Spinner";
import { getPostDate } from "../Verification";
import { useCallback } from "react";

const BlogDetails = () => {
  const blogId = useParams().id;
  const navigate = useNavigate();
  console.log(blogId);

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.modal.isLoading);
  const loadModal = useSelector((state) => state.modal.loadModal);
  const loadModalMessage = useSelector((state) => state.modal.loadModalMessage);

  const [data, setData] = useState({
    title: "",
    description: "",
    image: "",
    likes: [],
    comments: [],
    userName: "",
    createdAt: "",
    isOwner: false,
  });
  const [comment, setComment] = useState(false);
  const [liked, setLiked] = useState(false);

  const styles = {
    cursor:'pointer',
    color:liked?'blue':'black'
  }
  const handleEdit = () => {
    navigate(`/editblogs/${blogId}`);
  };

  const handleDelete = async() =>{
    try {
      dispatch(modalActions.setIsLoading(true)); // dispatch
      await axios.delete(
        `/api/v1/blogs/delete-blog/${blogId}`,
        {
          headers: {
            Authorization: sessionStorage.getItem("accessToken"),
          },
        }
      );
      dispatch(modalActions.setIsLoading(false)); // dispatch
      navigate('/home')
    } catch (error) {
      dispatch(modalActions.setIsLoading(false)); // dispatch
      dispatch(modalActions.setLoadModal(true)); // dispatch
      dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch
      console.log(error.response.data.message);
    }
  }

  const handleLike = async () => {
    if(data.isOwner){
      return
    }
    setLiked((pre) => !pre);
    try {
      await axios.put(`/api/v1/blogs/like/${blogId}`,'', {
        headers: {
          Authorization: sessionStorage.getItem("accessToken"),
        },
      });
    } catch (error) {
      console.log("error");
    }
    getBlogDetails();
  };

  const commentBlog = async (message) => {
    try {
      dispatch(modalActions.setIsLoading(true)); // dispatch
      await axios.put(
        `/api/v1/blogs/comment/${blogId}`,
        { message: message },
        {
          headers: {
            Authorization: sessionStorage.getItem("accessToken"),
          },
        }
      );
      dispatch(modalActions.setIsLoading(false)); // dispatch
      getBlogDetails();
    } catch (error) {
      dispatch(modalActions.setIsLoading(false)); // dispatch
      dispatch(modalActions.setLoadModal(true)); // dispatch
      dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch
      console.log(error.response.data.message);
    }
  };

  const getBlogDetails = async () => {
    const url = `/api/v1/blogs/get-blog/${blogId}`;
    console.log(url);
    try {
      dispatch(modalActions.setIsLoading(true)); // dispatch
      const { data } = await axios.get(url, {
        headers: {
          Authorization: sessionStorage.getItem("accessToken"),
        },
      });
      if (data?.success) {
        dispatch(modalActions.setIsLoading(false)); // dispatch
        setData({
          title: data.blog.title,
          description: data.blog.description,
          image: data.blog.image,
          likes: data.blog.likes,
          comments: data.blog.comments,
          userName: data.blog.user.username,
          createdAt: data.blog.createdAt,
          isOwner: data.isOwner,
        });
      }
    } catch (error) {
      dispatch(modalActions.setIsLoading(false)); // dispatch
      dispatch(modalActions.setLoadModal(true)); // dispatch
      dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    console.log('useeffect')
    getBlogDetails();
  }, []);

  return (
    <div className="container-md">
      <div className={classes.imageContainer}>
        <img className={classes.imageHeader} src={data.image} />
      </div>
      {data.isOwner && (
        <div className="d-flex justify-content-end align-items-center">
          <span>
            <MdModeEdit
              size="25"
              style={{ cursor: "pointer" }}
              onClick={handleEdit}
              className="mt-4 m-3 border border-dark rounded text-primary"
            />
          </span>
          <span>
            <MdDelete
              size="25"
              style={{ cursor: "pointer" }}
              onClick={handleDelete}
              className="mt-4 m-3 border border-dark rounded text-danger"
            />
          </span>
        </div>
      )}
      <div className="d-flex flex-column">
        <h4 className="fs-3 mt-4 text-center">{data.title}</h4>
        <div className="fs-5 d-flex justify-content-between">
          <span>Author : {data.userName}</span>
          <span>{getPostDate(data.createdAt)}</span>
        </div>
        <div>
          <MarkDown style={{ width: "100%" }} className="h-100">
            {data.description}
          </MarkDown>
        </div>
        <div className="d-flex justify-content-center m-2 mt-4">
          <div className={classes.footer}>
            <div className="d-flex flex-column">
              <div className="d-flex">
                <BiLike
                  size="20"
                  style={styles}
                  onClick={handleLike}
                />
                {data.likes.length>0 && <span>{data.likes.length}</span>}
              </div>
              <span>Like</span>
            </div>
            <div className="d-flex flex-column justify-content-center aligm-items-center">
              <FaRegCommentDots
                size="20"
                style={{ cursor: "pointer" }}
                onClick={() => setComment((pre) => !pre)}
              />
              <span className="text-center">comment</span>
            </div>
          </div>
        </div>
        {comment && (
          <div className="d-flex justify-content-center m-3">
            <Comment blogDetails={data} commentBlog={commentBlog} />
          </div>
        )}
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

export default BlogDetails;
