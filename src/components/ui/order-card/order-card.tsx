import React, { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-card.module.css';

import { OrderCardUIProps } from './type';
import { OrderStatus } from '@components';

export const OrderCardUI: FC<OrderCardUIProps> = memo(
  ({ orderInfo, maxIngredients, locationState }) => {
    const location = useLocation();

    const getUniqueIngredients = () => {
      if (
        !orderInfo.ingredientsInfo ||
        Object.keys(orderInfo.ingredientsInfo).length === 0
      ) {
        return [];
      }

      return Object.values(orderInfo.ingredientsInfo).map((item) => ({
        ...item,
        image: item.image_mobile || item.image || ''
      }));
    };

    const uniqueIngredients = getUniqueIngredients();

    const ingredientsToShow = uniqueIngredients.slice(0, maxIngredients);
    const remains =
      uniqueIngredients.length > maxIngredients
        ? uniqueIngredients.length - maxIngredients
        : 0;

    return (
      <Link
        to={orderInfo.number.toString()}
        relative='path'
        state={locationState}
        className={`p-6 mb-4 mr-2 ${styles.order}`}
      >
        <div className={styles.order_info}>
          <span className={`text text_type_digits-default ${styles.number}`}>
            #{String(orderInfo.number).padStart(6, '0')}
          </span>
          <span className='text text_type_main-default text_color_inactive'>
            <FormattedDate date={orderInfo.date} />
          </span>
        </div>
        <h4 className={`pt-6 text text_type_main-medium ${styles.order_name}`}>
          {orderInfo.name}
        </h4>
        {location.pathname === '/profile/orders' && (
          <OrderStatus status={orderInfo.status} />
        )}
        <div className={`pt-6 ${styles.order_content}`}>
          <ul className={styles.ingredients}>
            {ingredientsToShow.length > 0 ? (
              ingredientsToShow.map((ingredient, index) => {
                let zIndex = maxIngredients - index;
                let right = 20 * index;

                return (
                  <li
                    className={styles.img_wrap}
                    style={{
                      zIndex: zIndex,
                      right: right,
                      position: 'relative'
                    }}
                    key={`${ingredient._id}`}
                  >
                    <div className={styles.image_container}>
                      <img
                        className={styles.img}
                        src={ingredient.image || '/placeholder.png'}
                        alt={ingredient.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    {maxIngredients === index + 1 && remains > 0 ? (
                      <span
                        className={`text text_type_digits-default ${styles.remains}`}
                      >
                        +{remains}
                      </span>
                    ) : null}
                  </li>
                );
              })
            ) : orderInfo.ingredients && orderInfo.ingredients.length > 0 ? (
              orderInfo.ingredients
                .slice(0, maxIngredients)
                .map((ingredientId, index) => {
                  let zIndex = maxIngredients - index;
                  let right = 20 * index;

                  return (
                    <li
                      className={styles.img_wrap}
                      style={{
                        zIndex: zIndex,
                        right: right,
                        position: 'relative'
                      }}
                      key={`${ingredientId}-${index}`}
                    >
                      <div className={styles.image_container}>
                        <div className={styles.placeholder_img}>
                          <span className='text text_type_main-default'>
                            {ingredientId.slice(0, 2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })
            ) : (
              <li className={styles.no_ingredients}>
                <div className={styles.placeholder_container}>
                  <div className={styles.placeholder_img}>
                    <span className='text text_type_main-default text_color_inactive'>
                      🍔
                    </span>
                  </div>
                  <span className='text text_type_main-default text_color_inactive'>
                    Ингредиенты не указаны
                  </span>
                </div>
              </li>
            )}
          </ul>
          <div className={styles.price_container}>
            <span
              className={`text text_type_digits-default ${styles.order_total}`}
            >
              {orderInfo.total || 0}
            </span>
            <CurrencyIcon type='primary' />
          </div>
        </div>
      </Link>
    );
  }
);
