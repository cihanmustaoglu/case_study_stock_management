import { createSlice } from "@reduxjs/toolkit";

interface ProductState {
  data: any;
  loading: boolean;
  error: string;
}

const initialState: ProductState = {
  data: [],
  loading: false,
  error: "",
};

export const ChecklistSlice = createSlice({
  name: "checklist",
  initialState,
  reducers: {
    updateQuantityAmount: (state, action) => {
      var tmpData: any = state.data;
      var index = tmpData.findIndex((e: any) => e.id === action.payload.id);
      tmpData[index].quantity = action.payload.quantity;
      state.data = tmpData;
    },

    setList: (state, action) => {
      state.data = action.payload;
    },

    clearList: (state) => {
      state.data = [];
    },

    addList: (state, action) => {
      var index = state.data.findIndex((e: any) => e.id === action.payload.id);
      if (index === -1) {
        var tmpData = state.data;
        tmpData.push(action.payload);
        state.data = tmpData;
      } else {
        var tmpData = state.data.filter((e: any) => e.id !== action.payload.id);
        state.data = tmpData;
      }
    },
  },
});

export const { updateQuantityAmount, setList, clearList, addList } =
  ChecklistSlice.actions;

export default ChecklistSlice.reducer;
