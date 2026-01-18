import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { getFeedsApi, getOrdersApi } from '@api';

type FeedsState = {
  data?: TOrdersData | null;
  personalOrders?: any[];
  loading: boolean;
  error?: string | null;
};

const initialState: FeedsState = {
  data: null,
  personalOrders: [],
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

const slice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
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
  }
});

export default slice.reducer;
