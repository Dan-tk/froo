import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import taskReducer from './slices/taskSlice'; 
import authReducer from "./slices/authSlice" 
import taskCountReducer from './slices/taskCountSlice'

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,         
        tasks: taskReducer, 
        taskCount: taskCountReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});

/* // Dispatch restoreUser action on store creation
store.dispatch(restoreUser());
 */
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;