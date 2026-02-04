import { describe, it, expect } from '@jest/globals';
import constructorReducer, {
  moveIngredient,
  removeIngredient
} from '../constructor-slice';
import { TConstructorIngredient } from '@utils-types';

const mockIngredient: TConstructorIngredient = {
  _id: 'main-1',
  calories: 4242,
  carbohydrates: 242,
  fat: 142,
  id: 'main-1',
  image: 'image-url',
  image_large: 'image-large-url',
  image_mobile: 'image-mobile-url',
  name: 'Биокотлета из марсианской Магнолии',
  price: 424,
  proteins: 420,
  type: 'main'
};

describe('constructorSlice', () => {
  describe('moveIngredient', () => {
    it('должен корректно перемещать ингредиенты при валидных индексах', () => {
      const secondIngredient: TConstructorIngredient = {
        ...mockIngredient,
        id: 'main-2',
        _id: 'main-2',
        name: 'Вторая котлетa'
      };

      const initialState = {
        bun: null,
        ingredients: [mockIngredient, secondIngredient],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        moveIngredient({ dragIndex: 0, hoverIndex: 1 })
      );

      expect(state.ingredients).toHaveLength(2);

      expect(state.ingredients[0].id).toBe('main-2');
      expect(state.ingredients[1].id).toBe('main-1');
    });

    it('должен игнорировать перемещение при одинаковых индексах', () => {
      const secondIngredient: TConstructorIngredient = {
        ...mockIngredient,
        id: 'main-2',
        _id: 'main-2',
        name: 'Вторая котлетa'
      };

      const initialState = {
        bun: null,
        ingredients: [mockIngredient, secondIngredient],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        moveIngredient({ dragIndex: 0, hoverIndex: 0 })
      );

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).toBe('main-1');
      expect(state.ingredients[1].id).toBe('main-2');
    });

    it('должен корректно работать с одним элементом', () => {
      const initialState = {
        bun: null,
        ingredients: [mockIngredient],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        moveIngredient({ dragIndex: 0, hoverIndex: 0 })
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockIngredient);
    });
  });

  describe('removeIngredient', () => {
    it('должен корректно удалять ингредиент по существующему id', () => {
      const secondIngredient: TConstructorIngredient = {
        ...mockIngredient,
        id: 'main-2',
        _id: 'main-2',
        name: 'Вторая котлетa'
      };

      const initialState = {
        bun: null,
        ingredients: [mockIngredient, secondIngredient],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        removeIngredient('main-1')
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('main-2');
    });

    it('должен игнорировать удаление при несуществующем id', () => {
      const initialState = {
        bun: null,
        ingredients: [mockIngredient],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        removeIngredient('non-existent-id')
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockIngredient);
    });

    it('должен корректно работать с пустым массивом', () => {
      const initialState = {
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        removeIngredient('any-id')
      );

      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('дополнительные случаи', () => {
    it('должен корректно обрабатывать граничные индексы', () => {
      const ingredients = [
        mockIngredient,
        { ...mockIngredient, id: 'main-2', _id: 'main-2' },
        { ...mockIngredient, id: 'main-3', _id: 'main-3' }
      ];

      const initialState = {
        bun: null,
        ingredients,
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        moveIngredient({ dragIndex: 0, hoverIndex: 2 })
      );

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0].id).toBe('main-2');
      expect(state.ingredients[1].id).toBe('main-3');
      expect(state.ingredients[2].id).toBe('main-1');
    });
  });
});
