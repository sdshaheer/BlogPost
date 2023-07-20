import React from "react";
import { useSelector } from "react-redux";
import { authActions } from "../reduxStore/AuthStore";
import { modalActions } from "../reduxStore/ModalStore";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect,useState } from "react";

const useGet = (url) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.modal.isLoading);
  const loadModal = useSelector((state) => state.modal.loadModal);
  const loadModalMessage = useSelector((state) => state.modal.loadModalMessage);
  const [fetchData,setFetchData] = useState(null)
  const [totalPages,setTotalPages] = useState(0)

  const fetchDetails = async() =>{
    try {
        dispatch(modalActions.setIsLoading(true)); // dispatch
        const {data}  = await axios.get(url, {
          headers: {
            Authorization: sessionStorage.getItem("accessToken"),
          },
        });
        console.log("useget"+" "+data.blogs)
        if(data?.success){
          dispatch(modalActions.setIsLoading(false)); // dispatch
          setFetchData(data.blogs)
          if (data.blogsCount % 3 == 0) {
            setTotalPages(Math.floor(data.blogsCount / 3));
          } else {
            setTotalPages(Math.floor(data.blogsCount / 3) + 1);
          }
        }
      } catch (error) {
        dispatch(modalActions.setIsLoading(false)); // dispatch
        dispatch(modalActions.setLoadModal(true)); // dispatch
        dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch
      }
  }

  useEffect(()=>{
    fetchDetails()
  },[url])

  return {fetchData,totalPages,isLoading,loadModal,loadModalMessage}
};

export default useGet;
