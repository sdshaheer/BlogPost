import { configureStore,combineReducers } from "@reduxjs/toolkit";
import AuthSliceReducer from "./AuthStore";
import ModalSliceReducer from "./ModalStore";

const reducer = combineReducers({
    auth: AuthSliceReducer,
    modal: ModalSliceReducer,
});

const store = configureStore({reducer})
export default store;
