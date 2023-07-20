import React from "react";
import classes from "./home.module.css";
import { categories } from "../Categories";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { modalActions } from "../../reduxStore/ModalStore";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import Blogs from "../../pages/blogsDisplay/Blogs";
import MyModal from "../../Modals/MyModal";
import Spinner from "../../Modals/Spinner";
import { useCallback } from "react";
import Pagination from "./Pagination";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.modal.isLoading);
  const loadModal = useSelector((state) => state.modal.loadModal);
  const loadModalMessage = useSelector((state) => state.modal.loadModalMessage);

  const limit=3
  const [category, setCategory] = useState('AllBlogs');
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(0);
  const [currPage, setCurrPage] = useState(1);

  const generateUrl = () =>{
      let urlString = ''
      if(category=='AllBlogs'){
        urlString+=`/api/v1/blogs/all-blogs`
      }
      else if(category=='MyBlogs'){
        urlString+=`/api/v1/blogs/user-blogs`
      }
      else{
        urlString+=`/api/v1/blogs/categories/${category}`
      }
      urlString+=`?limit=${limit}&skip=${currPage*limit-3}`
      console.log(urlString)
    return urlString
  }

  const handleCurrPage = useCallback((i) => {
    setCurrPage(i);
  },[currPage])

  const handlePrevPage = useCallback(() => {
    setCurrPage((prev) => prev - 1);
  },[currPage])

  const handleNextPage = useCallback(() => {
    setCurrPage((prev) => prev + 1);
  },[currPage])

  const handleCreate = () => {
    if (category === "" || category === 'MyBlogs') {
      alert("choose category hello");
      return;
    }
    navigate(`/createblog?category=${category}`);
  };

  // choosing category
  const handleCategory = (category) => {
    console.log(category);
    setCategory(category);
    setCurrPage(1)
  };


  const fetchBlogs = async () => {
    const url = generateUrl()

    try {
      dispatch(modalActions.setIsLoading(true));
      const { data } = await axios.get(url,{
        headers: {
          Authorization: sessionStorage.getItem("accessToken"),
        },
      });
      console.log('in fetch blogs'+" "+data)
      if (data && data.success) {
        dispatch(modalActions.setIsLoading(false));
        console.log(data.blogs)
        setData(data.blogs);
        if (data.blogsCount % 3 == 0) {
          setPages(Math.floor(data.blogsCount / 3));
        } else {
          setPages(Math.floor(data.blogsCount / 3) + 1);
        }
      }
    } catch (error) {
      dispatch(modalActions.setIsLoading(false)); // dispatch
      dispatch(modalActions.setLoadModal(true)); // dispatch
      dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchBlogs();
  }, [category,currPage]);

  console.log(data)
  return (
    <div className={classes.container}>
      <img
        className={classes.imageHeader}
        src="https://media.istockphoto.com/id/1198931639/photo/writing-a-blog-blogger-influencer-reading-text-on-screen.jpg?b=1&s=612x612&w=0&k=20&c=_C4iNvLOzKbbfbeTMsJ4mQf8OGQwYWJ8GWKLKRglrF8="
      />
      <div className="d-flex">
        <div className="d-flex flex-column">
          <button
            className={classes.createBlogButton}
            onClick={() => handleCreate()}
          >
            CREATE BLOG
          </button>
          <span className={classes.category} onClick={() => handleCategory("AllBlogs")}>
            All categories
          </span>
          <div className="d-flex flex-column ">
            {categories.map((category) => {
              return (
                <span
                  key={category.id}
                  className={classes.category}
                  onClick={() => handleCategory(category.type)}
                >
                  {category.type}
                </span>
              );
            })}
          </div>
        </div>
        <div className=" m-4 w-100">
          {!data || data.length==0 ? (
            <h2 className="text-center">No Blogs are posted</h2>
          ) : (
            <div>
              <Blogs blogs={data} />
              <div className="d-flex justify-content-center">
                <Pagination
                  pages={pages}
                  currPage={currPage}
                  handlePrev={handlePrevPage}
                  handleCurr={handleCurrPage}
                  handleNext={handleNextPage}
                />
              </div>

            </div>
          )}
        </div>
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

export default Home;
