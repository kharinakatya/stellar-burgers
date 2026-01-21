import { FC } from 'react';
import { TOrdersData } from '@utils-types';
import styles from './feed-info.module.css';

export type FeedInfoUIProps = {
  feed: TOrdersData | null;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};

export const FeedInfoUI: FC<FeedInfoUIProps> = ({
  feed,
  readyOrders,
  pendingOrders
}) => {
  if (!feed) {
    return (
      <div className={styles.feedInfo}>
        <div className='text text_type_main-default'>Загрузка данных...</div>
      </div>
    );
  }

  const { total, totalToday } = feed;

  return (
    <div className={styles.feedInfo}>
      <div className={styles.orders}>
        <div className={styles.ready}>
          <h3 className={`text text_type_main-medium ${styles.title}`}>
            Готовы:
          </h3>
          <ul className={styles.list}>
            {readyOrders.map((number) => (
              <li
                key={number}
                className={`text text_type_digits-default ${styles.readyItem}`}
              >
                {number}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.pending}>
          <h3 className={`text text_type_main-medium ${styles.title}`}>
            В работе:
          </h3>
          <ul className={styles.list}>
            {pendingOrders.map((number) => (
              <li
                key={number}
                className={`text text_type_digits-default ${styles.pendingItem}`}
              >
                {number}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.total}>
        <h3 className='text text_type_main-medium'>Выполнено за все время:</h3>
        <p className={`text text_type_digits-large ${styles.totalNumber}`}>
          {total}
        </p>
      </div>
      <div className={styles.total}>
        <h3 className='text text_type_main-medium'>Выполнено за сегодня:</h3>
        <p className={`text text_type_digits-large ${styles.totalNumber}`}>
          {totalToday}
        </p>
      </div>
    </div>
  );
};
