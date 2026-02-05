import { FC } from 'react';
import styles from './orders-list.module.css';
import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<OrdersListUIProps> = ({ orders }) => (
  <div className={`${styles.content}`}>
    {orders && orders.length > 0 ? (
      orders.map((order) => <OrderCard order={order} key={order._id} />)
    ) : (
      <div className='text text_type_main-default text_color_inactive'>
        Заказов пока нет
      </div>
    )}
  </div>
);
