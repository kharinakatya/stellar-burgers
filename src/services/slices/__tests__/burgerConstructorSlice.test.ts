import { describe, it, expect } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearConstructor
} from '../constructor-slice';
import { TConstructorIngredient } from '@utils-types';

const mockBun: TConstructorIngredient = {
  _id: 'bun-1',
  calories: 4242,
  carbohydrates: 242,
  fat: 142,
  id: 'bun-1',
  image: 'bun-image-url',
  image_large: 'bun-image-large-url',
  image_mobile: 'bun-image-mobile-url',
  name: 'Булка с кунжутом',
  price: 123,
  proteins: 120,
  type: 'bun'
};

const mockMain: TConstructorIngredient = {
  _id: 'main-1',
  calories: 4242,
  carbohydrates: 242,
  fat: 142,
  id: 'main-1',
  image: 'main-image-url',
  image_large: 'main-image-large-url',
  image_mobile: 'main-image-mobile-url',
  name: 'Биокотлета из марсианской Магнолии',
  price: 424,
  proteins: 420,
  type: 'main'
};

const mockSauce: TConstructorIngredient = {
  _id: 'sauce-1',
  calories: 100,
  carbohydrates: 10,
  fat: 5,
  id: 'sauce-1',
  image: 'sauce-image-url',
  image_large: 'sauce-image-large-url',
  image_mobile: 'sauce-image-mobile-url',
  name: 'Соус из моркови',
  price: 80,
  proteins: 2,
  type: 'sauce'
};

describe('constructorSlice', () => {
  describe('addIngredient', () => {
    it('должен добавлять булку в state.bun и очищать предыдущую', () => {
      const initialState = {
        bun: { ...mockBun, id: 'old-bun' },
        ingredients: [],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        addIngredient(mockBun)
      );

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен добавлять не-булку в state.ingredients, не трогая bun', () => {
      const initialState = {
        bun: mockBun,
        ingredients: [],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        addIngredient(mockMain)
      );

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockMain);
    });

    it('должен добавлять несколько ингредиентов в state.ingredients', () => {
      const initialState = {
        bun: mockBun,
        ingredients: [],
        orderRequest: false,
        orderData: null,
        error: null
      };

      let state = constructorReducer(
        initialState,
        addIngredient(mockMain)
      );

      state = constructorReducer(
        state,
        addIngredient(mockSauce)
      );

      state = constructorReducer(
        state,
        addIngredient({ ...mockMain, id: 'main-2' })
      );

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]).toEqual(mockMain);
      expect(state.ingredients[1]).toEqual(mockSauce);
      expect(state.ingredients[2].id).toBe('main-2');
    });

    it('должен добавлять соус как обычный ингредиент (не булка)', () => {
      const initialState = {
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        addIngredient(mockSauce)
      );

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockSauce);
    });

    it('должен корректно обрабатывать добавление булки после других ингредиентов', () => {
      const initialState = {
        bun: null,
        ingredients: [mockMain, mockSauce],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        addIngredient(mockBun)
      );

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]).toEqual(mockMain);
      expect(state.ingredients[1]).toEqual(mockSauce);
    });

    it('должен заменять булку, если добавить новую', () => {
      const initialState = {
        bun: { ...mockBun, id: 'old-bun', name: 'Старая булка' },
        ingredients: [mockMain],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        addIngredient(mockBun)
      );

      expect(state.bun).toEqual(mockBun);
      expect(state.bun?.name).not.toEqual('Старая булка');
      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    it('должен корректно перемещать ингредиенты при валидных индексах', () => {
      const secondIngredient: TConstructorIngredient = {
        ...mockMain,
        id: 'main-2',
        _id: 'main-2',
        name: 'Вторая котлета'
      };

      const initialState = {
        bun: mockBun,
        ingredients: [mockMain, secondIngredient],
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
        ...mockMain,
        id: 'main-2',
        _id: 'main-2',
        name: 'Вторая котлета'
      };

      const initialState = {
        bun: mockBun,
        ingredients: [mockMain, secondIngredient],
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
        bun: mockBun,
        ingredients: [mockMain],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        moveIngredient({ dragIndex: 0, hoverIndex: 0 })
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockMain);
    });
  });

  describe('removeIngredient', () => {
    it('должен корректно удалять ингредиент по существующему id', () => {
      const secondIngredient: TConstructorIngredient = {
        ...mockMain,
        id: 'main-2',
        _id: 'main-2',
        name: 'Вторая котлета'
      };

      const initialState = {
        bun: mockBun,
        ingredients: [mockMain, secondIngredient],
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
        bun: mockBun,
        ingredients: [mockMain],
        orderRequest: false,
        orderData: null,
        error: null
      };

      const state = constructorReducer(
        initialState,
        removeIngredient('non-existent-id')
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockMain);
    });

    it('должен корректно работать с пустым массивом', () => {
      const initialState = {
        bun: mockBun,
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

  describe('clearConstructor', () => {
    it('должен очищать весь конструктор', () => {
      const initialState = {
        bun: mockBun,
        ingredients: [mockMain, mockSauce],
        orderRequest: true,
        orderData: { number: 123 } as any,
        error: 'some error'
      };

      const state = constructorReducer(
        initialState,
        clearConstructor()
      );

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
      expect(state.orderRequest).toBe(false);
      expect(state.orderData).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('дополнительные случаи', () => {
    it('должен корректно обрабатывать граничные индексы', () => {
      const ingredients = [
        mockMain,
        { ...mockMain, id: 'main-2', _id: 'main-2' },
        { ...mockMain, id: 'main-3', _id: 'main-3' }
      ];

      const initialState = {
        bun: mockBun,
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
