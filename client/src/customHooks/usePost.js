import React from 'react'
import { useSelector } from 'react-redux'
import { authActions } from '../reduxStore/AuthStore'
import { modalActions } from '../reduxStore/ModalStore'
import { useDispatch } from 'react-redux'

const usePost = (url,data) => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.modal.isLoading);
    const loadModal = useSelector((state) => state.modal.loadModal);
    const loadModalMessage = useSelector((state) => state.modal.loadModalMessage);
    try{
        const data = axios.post(url,data)
    }
    catch(error){
            
    }

}

export default usePost