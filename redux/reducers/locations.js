import { createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-root-toast";

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
        Toast.show(`Added ${action.payload.name}`, {
          duration: 5000,
          position: Toast.positions.CENTER,
        });
      }
    },
    remove: (state, action) => {
      state.locations = state.locations.filter(
        (loc) => loc.name !== action.payload.name
      );
      Toast.show(`Removed ${action.payload.name}`, {
        duration: 5000,
        position: Toast.positions.CENTER,
      });
    },
    clearAll: (state) => {
      Toast.show(`Clearing all ${state.locations.length} locations`, {
        duration: 5000,
        position: Toast.positions.CENTER,
      });
      state.locations = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrent, add, remove, clearAll } = locationsSlice.actions;

export default locationsSlice.reducer;
