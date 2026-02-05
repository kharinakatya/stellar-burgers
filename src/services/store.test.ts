import { describe, it, expect } from '@jest/globals';
import store, { RootState } from '../services/store';

describe('Redux Store', () => {
  it('should have correct initial state structure', () => {
    const state = store.getState();

    expect(state).toEqual({
      ingredients: expect.any(Object),
      user: expect.any(Object),
      feeds: expect.any(Object),
      burgerConstructor: expect.any(Object)
    });

    expect(state.ingredients).toHaveProperty('items');
    expect(state.ingredients).toHaveProperty('loading');
    expect(state.ingredients).toHaveProperty('error');

    expect(state.user).toHaveProperty('user');
    expect(state.user).toHaveProperty('isAuth');
    expect(state.user).toHaveProperty('isInitialized');
    expect(state.user).toHaveProperty('loading');
    expect(state.user).toHaveProperty('error');

    expect(state.feeds).toHaveProperty('data');
    expect(state.feeds).toHaveProperty('personalOrders');
    expect(state.feeds).toHaveProperty('currentOrder');
    expect(state.feeds).toHaveProperty('loading');
    expect(state.feeds).toHaveProperty('error');

    expect(state.burgerConstructor).toHaveProperty('bun');
    expect(state.burgerConstructor).toHaveProperty('ingredients');
    expect(state.burgerConstructor).toHaveProperty('orderRequest');
    expect(state.burgerConstructor).toHaveProperty('orderData');
    expect(state.burgerConstructor).toHaveProperty('error');
  });

  it('should have correct initial values for feeds slice', () => {
    const state = store.getState();

    expect(state.feeds.data).toBeNull();
    expect(state.feeds.personalOrders).toEqual([]);
    expect(state.feeds.currentOrder).toBeNull();
    expect(state.feeds.loading).toBe(false);
    expect(state.feeds.error).toBeNull();
  });

  it('should handle unknown action types without changing state', () => {
    const initialState = store.getState();

    store.dispatch({ type: 'UNKNOWN_ACTION' });
    const newState = store.getState();

    expect(newState).toEqual(initialState);
  });

  it('should have correct RootState type', () => {
    const state: RootState = store.getState();

    expect(state.ingredients).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.feeds).toBeDefined();
    expect(state.burgerConstructor).toBeDefined();
  });
});
