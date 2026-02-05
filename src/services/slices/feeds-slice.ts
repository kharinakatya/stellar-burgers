import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData, TOrder } from '@utils-types';
import { getFeedsApi, getOrdersApi, getOrderByNumberApi } from '@api';

type FeedsState = {
  data?: TOrdersData | null;
  personalOrders?: any[];
  currentOrder?: TOrder | null;
  loading: boolean;
  error?: string | null;
};

const initialState: FeedsState = {
  data: null,
  personalOrders: [],
  currentOrder: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feeds/fetch', async () => {
  const data = await getFeedsApi();
  return data;
});

export const fetchPersonalOrders = createAsyncThunk(
  'feeds/fetchPersonal',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'feeds/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (response.success && response.orders.length > 0) {
      return response.orders[0];
    }
    throw new Error('Заказ не найден');
  }
);

const slice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeeds.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(fetchFeeds.fulfilled, (s, action) => {
      s.loading = false;
      s.data = action.payload;
    });
    builder.addCase(fetchFeeds.rejected, (s, action) => {
      s.loading = false;
      s.error = action.error.message || 'Ошибка ленты заказов';
    });

    builder.addCase(fetchPersonalOrders.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(fetchPersonalOrders.fulfilled, (s, action) => {
      s.loading = false;
      s.personalOrders = action.payload;
    });
    builder.addCase(fetchPersonalOrders.rejected, (s, action) => {
      s.loading = false;
      s.error = action.error.message || 'Ошибка персональных заказов';
    });

    builder.addCase(fetchOrderByNumber.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(fetchOrderByNumber.fulfilled, (s, action) => {
      s.loading = false;
      s.currentOrder = action.payload;
    });
    builder.addCase(fetchOrderByNumber.rejected, (s, action) => {
      s.loading = false;
      s.error = action.error.message || 'Ошибка загрузки заказа';
    });
  }
});

export const { clearCurrentOrder } = slice.actions;
export default slice.reducer;
