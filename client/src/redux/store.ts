import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./map";
import userReducer from "./user";


const store = configureStore({
  reducer: {
    map: mapReducer,
    user: userReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
