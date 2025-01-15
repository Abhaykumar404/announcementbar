import { createSlice } from "@reduxjs/toolkit";
import { globalStateInitialData } from "../../utils/constants";

const globalStateSlice = createSlice({
  name: "globaState",
  initialState: globalStateInitialData,
  reducers: {
    setDiscardedState: (state, action) => {
      state.discardState = action.payload;
    },
    setListOfErrors: (state, action) => {
      state.listOfErrors = action.payload;
    },
  },
});

export default globalStateSlice.reducer;
export const { setDiscardedState, setListOfErrors } = globalStateSlice.actions;
