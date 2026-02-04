import feedsReducer, {
  fetchFeeds,
  fetchPersonalOrders,
  fetchOrderByNumber,
  clearCurrentOrder
} from '../feeds-slice';
import { TOrder, TOrdersData } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Space бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['bun-1', 'main-1']
};

const mockOrdersData: TOrdersData = {
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

describe('feedsSlice', () => {
  describe('initial state', () => {
    it('должен возвращать начальное состояние', () => {
      const initialState = feedsReducer(undefined, { type: 'unknown' });
      expect(initialState).toEqual({
        data: null,
        personalOrders: [],
        currentOrder: null,
        loading: false,
        error: null
      });
    });
  });

  describe('fetchFeeds async thunk', () => {
    it('должен устанавливать loading в true при pending', () => {
      const state = feedsReducer(undefined, { type: 'feeds/fetch/pending' });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записывать данные при fulfilled', () => {
      const pendingState = feedsReducer(undefined, {
        type: 'feeds/fetch/pending'
      });
      const fulfilledState = feedsReducer(pendingState, {
        type: 'feeds/fetch/fulfilled',
        payload: mockOrdersData
      });
      expect(fulfilledState.loading).toBe(false);
      expect(fulfilledState.data).toEqual(mockOrdersData);
      expect(fulfilledState.error).toBeNull();
    });

    it('должен записывать ошибку при rejected', () => {
      const pendingState = feedsReducer(undefined, {
        type: 'feeds/fetch/pending'
      });
      const rejectedState = feedsReducer(pendingState, {
        type: 'feeds/fetch/rejected',
        error: { message: 'Ошибка ленты заказов' }
      });
      expect(rejectedState.loading).toBe(false);
      expect(rejectedState.error).toBe('Ошибка ленты заказов');
    });
  });

  describe('fetchPersonalOrders async thunk', () => {
    it('должен устанавливать loading в true при pending', () => {
      const state = feedsReducer(undefined, {
        type: 'feeds/fetchPersonal/pending'
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записывать персональные заказы при fulfilled', () => {
      const pendingState = feedsReducer(undefined, {
        type: 'feeds/fetchPersonal/pending'
      });
      const fulfilledState = feedsReducer(pendingState, {
        type: 'feeds/fetchPersonal/fulfilled',
        payload: [mockOrder]
      });
      expect(fulfilledState.loading).toBe(false);
      expect(fulfilledState.personalOrders).toEqual([mockOrder]);
      expect(fulfilledState.error).toBeNull();
    });

    it('должен записывать ошибку при rejected', () => {
      const pendingState = feedsReducer(undefined, {
        type: 'feeds/fetchPersonal/pending'
      });
      const rejectedState = feedsReducer(pendingState, {
        type: 'feeds/fetchPersonal/rejected',
        error: { message: 'Ошибка персональных заказов' }
      });
      expect(rejectedState.loading).toBe(false);
      expect(rejectedState.error).toBe('Ошибка персональных заказов');
    });
  });

  describe('fetchOrderByNumber async thunk', () => {
    it('должен устанавливать loading в true при pending', () => {
      const state = feedsReducer(undefined, {
        type: 'feeds/fetchOrderByNumber/pending'
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записывать текущий заказ при fulfilled', () => {
      const pendingState = feedsReducer(undefined, {
        type: 'feeds/fetchOrderByNumber/pending'
      });
      const fulfilledState = feedsReducer(pendingState, {
        type: 'feeds/fetchOrderByNumber/fulfilled',
        payload: mockOrder
      });
      expect(fulfilledState.loading).toBe(false);
      expect(fulfilledState.currentOrder).toEqual(mockOrder);
      expect(fulfilledState.error).toBeNull();
    });

    it('должен записывать ошибку при rejected', () => {
      const pendingState = feedsReducer(undefined, {
        type: 'feeds/fetchOrderByNumber/pending'
      });
      const rejectedState = feedsReducer(pendingState, {
        type: 'feeds/fetchOrderByNumber/rejected',
        error: { message: 'Ошибка загрузки заказа' }
      });
      expect(rejectedState.loading).toBe(false);
      expect(rejectedState.error).toBe('Ошибка загрузки заказа');
    });
  });

  describe('clearCurrentOrder action', () => {
    it('должен очищать текущий заказ и ошибку', () => {
      const initialState = {
        data: mockOrdersData,
        personalOrders: [mockOrder],
        currentOrder: mockOrder,
        loading: false,
        error: 'Some error'
      };
      const state = feedsReducer(initialState, clearCurrentOrder());
      expect(state.currentOrder).toBeNull();
      expect(state.error).toBeNull();
      expect(state.data).toEqual(mockOrdersData);
      expect(state.personalOrders).toEqual([mockOrder]);
    });
  });
});
