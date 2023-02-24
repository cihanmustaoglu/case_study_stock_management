import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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

export const fetchProduct = createAsyncThunk("fetchProduct", async () => {
  // const response = await axios.get<Product>("http://localhost:999/api/tutorials");
  const response = await axios.get<Product>("http://test.apithon.com.tr/api/tutorials");
  return response.data;
});

export const productDelete = createAsyncThunk('productDelete', async (id:any) => {
  // const res = await axios.delete<Product>(`http://localhost:999/api/tutorials/${id}`);
  const res = await axios.delete<Product>(`http://test.apithon.com.tr/api/tutorials/${id}`);
  return res.data;
});

export const productCreate = createAsyncThunk('productCreate', async (data:any) => {
  // const res = await axios.post<Product>(`http://localhost:999/api/tutorials/`, data);
  const res = await axios.post<Product>(`http://test.apithon.com.tr/api/tutorials/`, data);
  return res.data;
});

export const productUpdate = createAsyncThunk('productUpdate', async (data:any) => {
  // const res = await axios.put<Product>(`http://localhost:999/api/tutorials/${data.id}`,data);
  const res = await axios.put<Product>(`http://test.apithon.com.tr/api/tutorials/${data.id}`,data);
  return res.data;
});

export const ProductSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    arama: (state, action) => {
      let value = action.payload;
      let filteredValues = state.data.filter((product: any) => {
        return product.name.toLowerCase().includes(value);
      });
      state.data = filteredValues;
    },
    updateQuantity: (state, action) => {
      var index = state.data.findIndex((e: any) => e.id === action.payload.id);
      var tmpData = state.data[index];
      tmpData.quantity = action.payload.quantity;
      state.data[index] = tmpData;
    },
    deleteProduct: (state, action) => {
      var tmpData: any = state.data.filter((e: any) => e.id !== action.payload);
      state.data = tmpData;
    },
    setProductList:(state,action) => {
      state.data=action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      fetchProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.data = action.payload;
        state.loading = false;
      }
    );

    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = "Ürünlere ait veriler alınırken bir hata oluştu!";
    });

    // DELETE

    builder.addCase(productDelete.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      productDelete.fulfilled,
      (state, action) => {
        state.loading = false;
      }
    );

    builder.addCase(productDelete.rejected, (state, action) => {
      state.loading = false;
      state.error = "Ürün silinirken bir hata oluştu!";
    });

    // CREATE

    builder.addCase(productCreate.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      productCreate.fulfilled,
      (state, action: PayloadAction<Product>) => {
        var tmpData: any = [...state.data,action.payload];
        state.data=tmpData;
        state.loading = false;
      }
    );

    builder.addCase(productCreate.rejected, (state, action) => {
      state.loading = false;
      state.error = "Ürün eklenirken bir hata oluştu!";
    });

    // UPDATE

    builder.addCase(productUpdate.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      productUpdate.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
      }
    );

    builder.addCase(productUpdate.rejected, (state) => {
      state.loading = false;
      state.error = "Ürün güncellenirken bir hata oluştu!";
    });
  },
});

export type Root = Product[];

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export const {
  arama,
  updateQuantity,
  deleteProduct,
  setProductList
} = ProductSlice.actions;

export default ProductSlice.reducer;
