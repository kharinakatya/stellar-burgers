import { FC, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchPersonalOrders } from '../../services/slices/feeds-slice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const { personalOrders, loading, error } = useSelector(
    (state) => state.feeds
  );

  const { isAuth, user } = useSelector((state) => state.user);

  useEffect(() => {
    console.log('=== PROFILE ORDERS DEBUG ===');
    console.log('User:', {
      name: user?.name,
      email: user?.email,
      isAuth
    });
    console.log('Personal orders:', {
      count: personalOrders?.length || 0,
      orders: personalOrders?.slice(0, 3)
    });
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [personalOrders, loading, error, user, isAuth]);

  const handleGetFeeds = useCallback(() => {
    console.log('Fetching personal orders...');
    dispatch(fetchPersonalOrders());
  }, [dispatch]);

  useEffect(() => {
    if (isAuth) {
      console.log('User is authenticated, fetching personal orders...');
      handleGetFeeds();
    } else {
      console.log('User is not authenticated, skipping personal orders fetch');
    }
  }, [handleGetFeeds, isAuth]);

  useEffect(() => {
    if (!isAuth) return;

    const interval = setInterval(() => {
      console.log('Auto-refresh personal orders...');
      handleGetFeeds();
    }, 30000);

    return () => clearInterval(interval);
  }, [handleGetFeeds, isAuth]);

  if (loading && (!personalOrders || personalOrders.length === 0)) {
    console.log('Showing preloader...');
    return <Preloader />;
  }

  if (error) {
    console.error('Profile orders error:', error);
    return (
      <div className='text text_type_main-default text_color_error'>
        Ошибка загрузки заказов: {error}
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className='text text_type_main-default'>
        Для просмотра ваших заказов необходимо авторизоваться
      </div>
    );
  }

  const orders = personalOrders || [];

  console.log('Rendering FeedUI with personal orders:', {
    count: orders.length,
    user: user?.name
  });

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
