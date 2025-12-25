import { configureStore } from '@reduxjs/toolkit'
import authSlice from "./Auth/AuthSlice.js"
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './api/apiSlice.js'


const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
})
setupListeners(store.dispatch)

export default store