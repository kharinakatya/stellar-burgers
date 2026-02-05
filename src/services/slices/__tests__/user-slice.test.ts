import userReducer, {
  loginUser,
  registerUser,
  fetchUser,
  updateUser,
  logout,
  forceLogout,
  resetInitialization
} from '../user-slice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('userSlice', () => {
  describe('initial state', () => {
    it('должен возвращать начальное состояние', () => {
      const initialState = userReducer(undefined, { type: 'unknown' });
      expect(initialState).toEqual({
        user: null,
        isAuth: false,
        loading: false,
        error: null,
        isInitialized: false
      });
    });
  });

  describe('loginUser async thunk', () => {
    it('должен устанавливать loading в true при pending', () => {
      const state = userReducer(undefined, { type: 'user/login/pending' });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен устанавливать user, isAuth и isInitialized при fulfilled', () => {
      const pendingState = userReducer(undefined, {
        type: 'user/login/pending'
      });
      const fulfilledState = userReducer(pendingState, {
        type: 'user/login/fulfilled',
        payload: mockUser
      });
      expect(fulfilledState.loading).toBe(false);
      expect(fulfilledState.user).toEqual(mockUser);
      expect(fulfilledState.isAuth).toBe(true);
      expect(fulfilledState.isInitialized).toBe(true);
      expect(fulfilledState.error).toBeNull();
    });

    it('должен записывать ошибку при rejected', () => {
      const pendingState = userReducer(undefined, {
        type: 'user/login/pending'
      });
      const rejectedState = userReducer(pendingState, {
        type: 'user/login/rejected',
        error: { message: 'Ошибка логина' }
      });
      expect(rejectedState.loading).toBe(false);
      expect(rejectedState.error).toBe('Ошибка логина');
      expect(rejectedState.isInitialized).toBe(true);
    });
  });

  describe('registerUser async thunk', () => {
    it('должен устанавливать loading в true при pending', () => {
      const state = userReducer(undefined, { type: 'user/register/pending' });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен устанавливать user, isAuth и isInitialized при fulfilled', () => {
      const pendingState = userReducer(undefined, {
        type: 'user/register/pending'
      });
      const fulfilledState = userReducer(pendingState, {
        type: 'user/register/fulfilled',
        payload: mockUser
      });
      expect(fulfilledState.loading).toBe(false);
      expect(fulfilledState.user).toEqual(mockUser);
      expect(fulfilledState.isAuth).toBe(true);
      expect(fulfilledState.isInitialized).toBe(true);
    });

    it('должен записывать ошибку при rejected', () => {
      const pendingState = userReducer(undefined, {
        type: 'user/register/pending'
      });
      const rejectedState = userReducer(pendingState, {
        type: 'user/register/rejected',
        error: { message: 'Ошибка регистрации' }
      });
      expect(rejectedState.loading).toBe(false);
      expect(rejectedState.error).toBe('Ошибка регистрации');
      expect(rejectedState.isInitialized).toBe(true);
    });
  });

  describe('fetchUser async thunk', () => {
    it('должен устанавливать loading в true и isInitialized в false при pending', () => {
      const state = userReducer(undefined, { type: 'user/fetch/pending' });
      expect(state.loading).toBe(true);
      expect(state.isInitialized).toBe(false);
      expect(state.error).toBeNull();
    });

    it('должен устанавливать user, isAuth и isInitialized при fulfilled', () => {
      const pendingState = userReducer(undefined, {
        type: 'user/fetch/pending'
      });
      const fulfilledState = userReducer(pendingState, {
        type: 'user/fetch/fulfilled',
        payload: mockUser
      });
      expect(fulfilledState.loading).toBe(false);
      expect(fulfilledState.user).toEqual(mockUser);
      expect(fulfilledState.isAuth).toBe(true);
      expect(fulfilledState.isInitialized).toBe(true);
    });

    it('должен сбрасывать авторизацию и записывать ошибку при rejected', () => {
      const initialState = {
        user: mockUser,
        isAuth: true,
        loading: false,
        error: null,
        isInitialized: true
      };
      const pendingState = userReducer(initialState, {
        type: 'user/fetch/pending'
      });
      const rejectedState = userReducer(pendingState, {
        type: 'user/fetch/rejected',
        error: { message: 'Ошибка получения пользователя' }
      });
      expect(rejectedState.loading).toBe(false);
      expect(rejectedState.user).toBeNull();
      expect(rejectedState.isAuth).toBe(false);
      expect(rejectedState.error).toBe('Ошибка получения пользователя');
      expect(rejectedState.isInitialized).toBe(true);
    });
  });

  describe('updateUser async thunk', () => {
    it('должен устанавливать loading в true при pending', () => {
      const state = userReducer(undefined, { type: 'user/update/pending' });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обновлять user при fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const initialState = {
        user: mockUser,
        isAuth: true,
        loading: false,
        error: null,
        isInitialized: true
      };
      const pendingState = userReducer(initialState, {
        type: 'user/update/pending'
      });
      const fulfilledState = userReducer(pendingState, {
        type: 'user/update/fulfilled',
        payload: updatedUser
      });
      expect(fulfilledState.loading).toBe(false);
      expect(fulfilledState.user).toEqual(updatedUser);
      expect(fulfilledState.user?.name).toBe('Updated Name');
    });

    it('должен записывать ошибку при rejected', () => {
      const pendingState = userReducer(undefined, {
        type: 'user/update/pending'
      });
      const rejectedState = userReducer(pendingState, {
        type: 'user/update/rejected',
        error: { message: 'Ошибка обновления' }
      });
      expect(rejectedState.loading).toBe(false);
      expect(rejectedState.error).toBe('Ошибка обновления');
    });
  });

  describe('logout async thunk', () => {
    it('должен сбрасывать состояние пользователя при fulfilled', () => {
      const initialState = {
        user: mockUser,
        isAuth: true,
        loading: false,
        error: 'Some error',
        isInitialized: true
      };
      const state = userReducer(initialState, {
        type: 'user/logout/fulfilled'
      });
      expect(state.user).toBeNull();
      expect(state.isAuth).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isInitialized).toBe(true);
    });

    it('должен сбрасывать состояние пользователя при rejected', () => {
      const initialState = {
        user: mockUser,
        isAuth: true,
        loading: false,
        error: 'Some error',
        isInitialized: true
      };
      const state = userReducer(initialState, {
        type: 'user/logout/rejected'
      });
      expect(state.user).toBeNull();
      expect(state.isAuth).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isInitialized).toBe(true);
    });
  });

  describe('forceLogout action', () => {
    it('должен принудительно разлогинивать пользователя', () => {
      const initialState = {
        user: mockUser,
        isAuth: true,
        loading: true,
        error: 'Some error',
        isInitialized: false
      };
      const state = userReducer(initialState, forceLogout());
      expect(state.user).toBeNull();
      expect(state.isAuth).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isInitialized).toBe(true);
    });
  });

  describe('resetInitialization action', () => {
    it('должен сбрасывать isInitialized', () => {
      const initialState = {
        user: mockUser,
        isAuth: true,
        loading: false,
        error: null,
        isInitialized: true
      };
      const state = userReducer(initialState, resetInitialization());
      expect(state.isInitialized).toBe(false);
      expect(state.user).toEqual(mockUser);
    });
  });
});
