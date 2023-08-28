import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locations: [],
  current: { latitude: 51.50853, longitude: -0.12574 },
};

export const locationsSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setCurrent: (state, action) => {
      state.current = action.payload;
    },
    add: (state, action) => {
      let found = state.locations.find((l) => l.name === action.payload.name);
      if (found) {
        return;
      } else {
        state.locations = [...state.locations, action.payload];
      }
    },
    remove: (state, action) => {
      state.locations = state.locations.filter(
        (loc) => loc.name !== action.payload.name
      );
    },
    clearAll: (state) => {
      state.locations = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrent, add, remove, clearAll } = locationsSlice.actions;

export default locationsSlice.reducer;
