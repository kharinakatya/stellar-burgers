import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

type UserState = {
  user?: TUser | null;
  isAuth: boolean;
  loading: boolean;
  error?: string | null;
};

const initialState: UserState = {
  user: null,
  isAuth: false,
  loading: false,
  error: null
};

type LoginData = { email: string; password: string };
type RegisterData = { name: string; email: string; password: string };

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: LoginData) => {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: RegisterData) => {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const fetchUser = createAsyncThunk('user/fetch', async () => {
  const res = await getUserApi();
  if (res && (res as any).user) return (res as any).user as TUser;
  throw new Error('Не удалось получить пользователя');
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<RegisterData>) => {
    const res = await updateUserApi(data);
    if (res && (res as any).user) return (res as any).user as TUser;
    throw new Error('Не удалось обновить пользователя');
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      await logoutApi();
    }
  } catch (error) {
    console.error('Ошибка при отправке запроса на выход:', error);
  } finally {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }

  return true;
});

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    forceLogout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(loginUser.fulfilled, (s, action) => {
      s.loading = false;
      s.user = action.payload;
      s.isAuth = true;
    });
    builder.addCase(loginUser.rejected, (s, action) => {
      s.loading = false;
      s.error = action.error.message || 'Ошибка логина';
    });

    builder.addCase(registerUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(registerUser.fulfilled, (s, action) => {
      s.loading = false;
      s.user = action.payload;
      s.isAuth = true;
    });
    builder.addCase(registerUser.rejected, (s, action) => {
      s.loading = false;
      s.error = action.error.message || 'Ошибка регистрации';
    });

    builder.addCase(fetchUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (s, action) => {
      s.loading = false;
      s.user = action.payload;
      s.isAuth = true;
    });
    builder.addCase(fetchUser.rejected, (s, action) => {
      s.loading = false;
      s.isAuth = false;
      s.error = action.error.message || 'Ошибка получения пользователя';
    });

    builder.addCase(updateUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(updateUser.fulfilled, (s, action) => {
      s.loading = false;
      s.user = action.payload;
    });
    builder.addCase(updateUser.rejected, (s, action) => {
      s.loading = false;
      s.error = action.error.message || 'Ошибка обновления';
    });

    builder.addCase(logout.fulfilled, (s) => {
      s.user = null;
      s.isAuth = false;
      s.loading = false;
      s.error = null;
    });

    builder.addCase(logout.rejected, (s) => {
      s.user = null;
      s.isAuth = false;
      s.loading = false;
      s.error = null;
    });
  }
});

export const { forceLogout } = slice.actions;
export default slice.reducer;
