import ingredientsReducer, {
  fetchIngredients,
  fetchIngredientById
} from '../ingredients-slice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image-url',
    image_large: 'image-large-url',
    image_mobile: 'image-mobile-url'
  },
  {
    _id: 'main-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'image-url',
    image_large: 'image-large-url',
    image_mobile: 'image-mobile-url'
  }
];

describe('ingredientsSlice', () => {
  describe('initial state', () => {
    it('должен возвращать начальное состояние', () => {
      const initialState = ingredientsReducer(undefined, { type: 'unknown' });
      expect(initialState).toEqual({
        items: [],
        loading: false,
        error: null
      });
    });
  });

  describe('fetchIngredients async thunk', () => {
    it('должен устанавливать loading в true при pending', () => {
      const state = ingredientsReducer(undefined, {
        type: 'ingredients/fetchAll/pending'
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записывать данные и устанавливать loading в false при fulfilled', () => {
      const pendingState = ingredientsReducer(undefined, {
        type: 'ingredients/fetchAll/pending'
      });
      const fulfilledState = ingredientsReducer(pendingState, {
        type: 'ingredients/fetchAll/fulfilled',
        payload: mockIngredients
      });
      expect(fulfilledState.loading).toBe(false);
      expect(fulfilledState.items).toEqual(mockIngredients);
      expect(fulfilledState.error).toBeNull();
    });

    it('должен записывать ошибку и устанавливать loading в false при rejected', () => {
      const pendingState = ingredientsReducer(undefined, {
        type: 'ingredients/fetchAll/pending'
      });
      const rejectedState = ingredientsReducer(pendingState, {
        type: 'ingredients/fetchAll/rejected',
        payload: 'Ошибка загрузки ингредиентов'
      });
      expect(rejectedState.loading).toBe(false);
      expect(rejectedState.error).toBe('Ошибка загрузки ингредиентов');
      expect(rejectedState.items).toHaveLength(0);
    });
  });

  describe('fetchIngredientById async thunk', () => {
    it('должен устанавливать loading в true при pending', () => {
      const state = ingredientsReducer(undefined, {
        type: 'ingredients/fetchById/pending'
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен добавлять ингредиент если его нет в списке при fulfilled', () => {
      const initialState = {
        items: [mockIngredients[0]],
        loading: true,
        error: null
      };
      const state = ingredientsReducer(initialState, {
        type: 'ingredients/fetchById/fulfilled',
        payload: mockIngredients[1]
      });
      expect(state.loading).toBe(false);
      expect(state.items).toHaveLength(2);
      expect(state.items[1]).toEqual(mockIngredients[1]);
    });

    it('должен обновлять существующий ингредиент при fulfilled', () => {
      const updatedIngredient = {
        ...mockIngredients[0],
        name: 'Обновленная булка',
        price: 1300
      };
      const initialState = {
        items: [mockIngredients[0]],
        loading: true,
        error: null
      };
      const state = ingredientsReducer(initialState, {
        type: 'ingredients/fetchById/fulfilled',
        payload: updatedIngredient
      });
      expect(state.loading).toBe(false);
      expect(state.items).toHaveLength(1);
      expect(state.items[0].name).toBe('Обновленная булка');
      expect(state.items[0].price).toBe(1300);
    });

    it('должен записывать ошибку при rejected', () => {
      const pendingState = ingredientsReducer(undefined, {
        type: 'ingredients/fetchById/pending'
      });
      const rejectedState = ingredientsReducer(pendingState, {
        type: 'ingredients/fetchById/rejected',
        payload: 'Ингредиент не найден'
      });
      expect(rejectedState.loading).toBe(false);
      expect(rejectedState.error).toBe('Ингредиент не найден');
    });
  });
});
