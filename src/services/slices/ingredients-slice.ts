import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

type IngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error?: string | null;
};

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchAll', async (_, thunkAPI) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Ошибка загрузки ингредиентов');
  }
});

export const fetchIngredientById = createAsyncThunk<
  TIngredient,
  string,
  { rejectValue: string }
>('ingredients/fetchById', async (id, thunkAPI) => {
  try {
    const allIngredients = await getIngredientsApi();
    const ingredient = allIngredients.find((item) => item._id === id);
    if (!ingredient) {
      return thunkAPI.rejectWithValue('Ингредиент не найден');
    }
    return ingredient;
  } catch (error) {
    return thunkAPI.rejectWithValue('Ошибка загрузки ингредиента');
  }
});

const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (s, action) => {
        s.loading = false;
        s.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload || 'Ошибка загрузки ингредиентов';
      });

    builder
      .addCase(fetchIngredientById.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchIngredientById.fulfilled, (s, action) => {
        s.loading = false;
        const index = s.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index >= 0) {
          s.items[index] = action.payload;
        } else {
          s.items.push(action.payload);
        }
      })
      .addCase(fetchIngredientById.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload || 'Ошибка загрузки ингредиента';
      });
  }
});

export default slice.reducer;
