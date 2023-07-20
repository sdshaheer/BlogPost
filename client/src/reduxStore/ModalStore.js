import {createSlice,} from '@reduxjs/toolkit'

const ModalSlice = createSlice({
    name:'modal',
    initialState:{
        isLoading:false,
        loadModal:false,
        loadModalMessage:''
    },
    reducers:{
        setIsLoading(state,action){
           state.isLoading =action.payload
        },
        setLoadModal(state,action){
            state.loadModal=action.payload
        },
        setLoadModalMessage(state,action){
            state.loadModalMessage=action.payload
        }
    }
})

export const modalActions = ModalSlice.actions
export default ModalSlice.reducer;


