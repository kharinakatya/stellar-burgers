import React, { FC, useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate
} from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';

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
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { fetchFeeds } from '../../services/slices/feeds-slice';

import styles from './app.module.css';

const RequireAuth: FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuth, isInitialized } = useSelector((state) => ({
    isAuth: state.user?.isAuth,
    isInitialized: state.user?.isInitialized
  }));
  const location = useLocation();

  if (!isInitialized) {
    return <div>Проверка авторизации...</div>;
  }

  if (!isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

const RequireNoAuth: FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuth = useSelector((state) => state.user?.isAuth);
  if (isAuth) return <Navigate to='/' replace />;
  return children;
};

const App: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location } | null;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());

    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = document.cookie.includes('accessToken');

    if (refreshToken || accessToken) {
      dispatch(fetchUser());
    } else {
    }
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

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
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <RequireAuth>
                <Modal title='Информация о заказе' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </RequireAuth>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
