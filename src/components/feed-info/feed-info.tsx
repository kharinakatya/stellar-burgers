import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder, TOrdersData } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const ordersData = useSelector((state) => state.feeds?.data);
  if (!ordersData) {
    return <FeedInfoUI feed={null} readyOrders={[]} pendingOrders={[]} />;
  }

  const { orders, total, totalToday } = ordersData;

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  const feed: TOrdersData = {
    orders,
    total,
    totalToday
  };

  return (
    <FeedInfoUI
      feed={feed}
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
    />
  );
};
