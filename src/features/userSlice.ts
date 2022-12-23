import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

// Reduxの方に追加したユーザー情報をアップロードする必要があるので
interface USER {
  displayName: string;
  photoUrl: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { uid: "", photoUrl: "", displayName: "" }
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      // ログアウトした際に空の文字列を持たせ、リセットさせる
      state.user = { uid: "", photoUrl: "", displayName: "" }
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    }
  },
});

export const { login, logout, updateUserProfile } = userSlice.actions;
// store.tsのreducer内の名前と一致する必要あり
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
