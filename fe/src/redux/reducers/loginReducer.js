import { createSlice } from "@reduxjs/toolkit"

const loginSlice = createSlice({

    name: "login",
    initialState: {
        user: {},
        // token: null,
        // isLoggedIn: false,
        error:''
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.error = null
        },
        loginFailed: (state, action) => {
            state.email = ''
            state.password = '';
            state.error = action.payload.error

        },
        
    }
})

export default loginSlice.reducer;
export const { loginSuccess, loginFailure } = loginSlice.actions;