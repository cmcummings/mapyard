import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string,
  name: string
}

interface UserState {
  user?: User 
}

const initialState: UserState = {}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  }
})

const userReducer = userSlice.reducer;

export const { setUser } = userSlice.actions;
export default userReducer;
