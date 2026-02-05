import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';

import ingredientsReducer from './slices/ingredients-slice';
import userReducer from './slices/user-slice';
import feedsReducer from './slices/feeds-slice';
import constructorReducer from './slices/constructor-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  feeds: feedsReducer,
  burgerConstructor: constructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () =>
  useReduxDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export default store;
