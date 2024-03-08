import { configureStore , combineReducers } from "@reduxjs/toolkit";
import loginReducer from "./reducers/loginReducer";
import postReducer from "./reducers/postReducer";

const rootReducer = combineReducers({
    loginReducer,
    postReducer
});


export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
});

