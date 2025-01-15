import { configureStore } from "@reduxjs/toolkit";
import announcementSlice from "./slices/announcement-slice";
import globalStateSlice from "./slices/global-state-slice";
const store = configureStore({
  reducer: {
    announcement: announcementSlice,
    globalState: globalStateSlice,
  },
});

export default store;
