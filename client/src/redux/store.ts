import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./map";


const store = configureStore({
  reducer: {
    map: mapReducer     
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
