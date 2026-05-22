import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    isLoggedIn: false,
    userData: null,
    socket: null,
    onlineUsers: {}
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        login: function(state,action){
            state.isLoggedIn = true
            state.userData = action.payload
        },
        logout: function(state,action){
            state.isLoggedIn = false
            state.userData = null
            state.onlineUsers = {}
        },
        setOnlineUsers: function(state,action){
            state.onlineUsers = action.payload
        },
        

    }
})

export const {login,logout,setSocket,setOnlineUsers} = authSlice.actions
export default authSlice.reducer