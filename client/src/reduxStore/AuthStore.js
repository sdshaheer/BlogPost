import {createSlice,configureStore} from '@reduxjs/toolkit'

const AuthSlice = createSlice({
    name:'auth',
    initialState:{
        isLogin:false || localStorage.getItem('isLogin'),
        isLoading:false,
        userName:''
    },
    reducers:{
        login(state){
            state.isLogin=true
        },
        logout(state){
            state.isLogin=false
        },
        setUserName(state,action){
           state.userName=action.payload
        }
    }
})

export const authActions = AuthSlice.actions
export default AuthSlice.reducer;

