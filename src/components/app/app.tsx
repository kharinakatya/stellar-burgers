import React, { FC, useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useParams
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../services/store';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { Modal } from '@components';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import { AppHeader } from '../app-header';

import { fetchUser } from '../../services/slices/user-slice';
import {
  fetchIngredients,
  fetchIngredientById
} from '../../services/slices/ingredients-slice';

import { AppDispatch } from '../../services/store';
import styles from './app.module.css';

const RequireAuth: FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuth = useSelector((state: RootState) => state.user?.isAuth);
  if (!isAuth) return <Navigate to='/login' replace />;
  return children;
};

const RequireNoAuth: FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuth = useSelector((state: RootState) => state.user?.isAuth);
  if (isAuth) return <Navigate to='/' replace />;
  return children;
};

const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const state = location.state as { background?: Location } | null;

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());

    if (id) {
      dispatch(fetchIngredientById(id));
    }
  }, [dispatch, id]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={
            <RequireNoAuth>
              <Login />
            </RequireNoAuth>
          }
        />
        <Route
          path='/register'
          element={
            <RequireNoAuth>
              <Register />
            </RequireNoAuth>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <RequireNoAuth>
              <ForgotPassword />
            </RequireNoAuth>
          }
        />
        <Route
          path='/reset-password'
          element={
            <RequireNoAuth>
              <ResetPassword />
            </RequireNoAuth>
          }
        />
        <Route
          path='/profile'
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <RequireAuth>
              <ProfileOrders />
            </RequireAuth>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <RequireAuth>
              <OrderInfo />
            </RequireAuth>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => window.history.back()}
              >
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Информация о заказе'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='Информация о заказе'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
