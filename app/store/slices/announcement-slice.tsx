import { createSlice } from "@reduxjs/toolkit";
import { initialAnnouncementData } from "../../utils/constants";
import merge from "lodash/merge";

const announcementSlice = createSlice({
  name: "announcement",
  initialState: initialAnnouncementData,
  reducers: {
    setAnnouncementSettings: (state, action) => {
      merge(state.settings, action.payload);
      state.hasUnsavedChanges = true;
    },
    setAnnouncementName: (state, action) => {
      state.name = action.payload;
      state.hasUnsavedChanges = true;
    },
    setAnnouncementType: (state, action) => {
      state.type = action.payload;
      state.hasUnsavedChanges = true;
    },
    setSingleAnnouncementText: (state, action) => {
      merge(state.singleAnnouncementText, action.payload);
      state.hasUnsavedChanges = true;
    },
    setSingleAnnouncementTitleTranslations: (state, action) => {
      state.singleAnnouncementText.announcementTitleTranslations =
        action.payload;
      state.hasUnsavedChanges = true;
    },
    setSingleAnnouncementSubheadingTranslations: (state, action) => {
      state.singleAnnouncementText.announcementSubheadingTranslations =
        action.payload;
      state.hasUnsavedChanges = true;
    },
    setSingleAnnouncementButtonTextTranslations: (state, action) => {
      state.singleAnnouncementText.buttonTextTranslations = action.payload;
      state.hasUnsavedChanges = true;
    },
    setMultipleAnnouncementTexts: (state, action) => {
      state.multipleAnnouncementTexts = action.payload;
      state.hasUnsavedChanges = true;
    },
    setAnnouncementPlacement: (state, action) => {
      merge(state.placement, action.payload);
      state.hasUnsavedChanges = true;
    },
    setAnnouncementStyles: (state, action) => {
      merge(state.styles, action.payload);
      state.hasUnsavedChanges = true;
    },
    setWholeStateWithTranslations: (state: any, action) => {
      Object.keys(action.payload).forEach((k) => {
        state[k] = action.payload[k];
      });
    },
    resetUnsavedChanges: (state) => {
      state.hasUnsavedChanges = false;
    },
    setAnnouncementDirty: (state, action) => {
      state.hasUnsavedChanges = true;
    },
  },
});

export default announcementSlice.reducer;
export const {
  setAnnouncementSettings,
  setAnnouncementName,
  setWholeStateWithTranslations,
  resetUnsavedChanges,
  setAnnouncementType,
  setSingleAnnouncementText,
  setSingleAnnouncementTitleTranslations,
  setSingleAnnouncementSubheadingTranslations,
  setSingleAnnouncementButtonTextTranslations,
  setMultipleAnnouncementTexts,
  setAnnouncementPlacement,
  setAnnouncementStyles,
} = announcementSlice.actions;
