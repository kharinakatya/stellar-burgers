import { FC, memo } from 'react';
import { useSelector } from '../../../../services/store';
import { useLocation } from 'react-router-dom';

import styles from './feed.module.css';

import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';

export const FeedUI: FC<FeedUIProps> = memo(({ orders, handleGetFeeds }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const isProfileOrders = location.pathname.includes('/profile/orders');
  const isFeed = location.pathname === '/feed';

  return (
    <main className={styles.containerMain} data-testid='feed-page'>
      <div
        className={`${styles.titleBox} mt-10 mb-5`}
        data-testid='feed-header'
      >
        <div className='flex flex-col'>
          <h1
            className={`${styles.title} text text_type_main-large`}
            data-testid='feed-title'
          >
            {isProfileOrders ? 'История заказов' : 'Лента заказов'}
          </h1>
        </div>
        {isFeed && (
          <RefreshButton
            text='Обновить'
            onClick={handleGetFeeds}
            extraClass={'ml-30'}
            data-testid='refresh-button'
          />
        )}
      </div>

      <div className='mb-6' data-testid='orders-status'>
        {orders.length === 0 && (
          <div
            className='text text_type_main-default text_color_inactive mt-2'
            data-testid='no-orders-message'
          >
            {isProfileOrders ? 'У вас пока нет заказов' : 'Заказы не найдены'}
          </div>
        )}
      </div>

      <div className={styles.main} data-testid='feed-content'>
        <div className={styles.columnOrders} data-testid='orders-column'>
          <OrdersList orders={orders} data-testid='orders-list' />
        </div>
        {isFeed && (
          <div className={styles.columnInfo} data-testid='feed-info-column'>
            <FeedInfo data-testid='feed-info' />
          </div>
        )}
      </div>
    </main>
  );
});
