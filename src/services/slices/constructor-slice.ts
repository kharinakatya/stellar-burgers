import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderData: TOrder | null;
  error?: string | null;
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'constructor/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

const slice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragItem = state.ingredients[dragIndex];
      const newIngredients = [...state.ingredients];
      newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, dragItem);
      state.ingredients = newIngredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderRequest = false;
      state.orderData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.orderRequest = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderData = action.payload;
      state.bun = null;
      state.ingredients = [];
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.orderRequest = false;
      state.error = action.error.message || 'Ошибка оформления заказа';
    });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = slice.actions;
export default slice.reducer;
