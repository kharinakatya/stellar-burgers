import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';
import { useSelector } from '../../../services/store';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => {
  const { bun, ingredients } = constructorItems;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isAuthenticated = user.isAuth;

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      if (onOrderClick) {
        onOrderClick();
      }
    }
  };

  return (
    <section
      className={styles.burger_constructor}
      data-testid='burger-constructor'
    >
      {bun ? (
        <div className={`${styles.element} mb-4 mr-4`} data-testid='bun-top'>
          <ConstructorElement
            type='top'
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
            data-testid='constructor-element-top'
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-testid='no-bun-top'
        >
          Выберите булки
        </div>
      )}

      <ul
        className={styles.elements}
        data-testid='constructor-ingredients-list'
      >
        {ingredients.length > 0 ? (
          ingredients.map((item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={ingredients.length}
              key={item.id}
              data-testid={`constructor-ingredient-${index}`}
            />
          ))
        ) : (
          <div
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
            data-testid='no-filling'
          >
            Выберите начинку
          </div>
        )}
      </ul>

      {bun ? (
        <div className={`${styles.element} mt-4 mr-4`} data-testid='bun-bottom'>
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
            data-testid='constructor-element-bottom'
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-testid='no-bun-bottom'
        >
          Выберите булки
        </div>
      )}

      <div className={`${styles.total} mt-10 mr-4`} data-testid='order-total'>
        <div className={`${styles.cost} mr-10`} data-testid='order-price'>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          onClick={handleOrderClick}
          data-testid='order-button'
        >
          Оформить заказ
        </Button>
      </div>

      {orderRequest && (
        <Modal
          onClose={closeOrderModal}
          title={'Оформляем заказ...'}
          data-testid='order-loading-modal'
        >
          <Preloader />
        </Modal>
      )}

      {orderModalData && (
        <Modal
          onClose={closeOrderModal}
          title={orderRequest ? 'Оформляем заказ...' : ''}
          data-testid='order-details-modal'
        >
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}
    </section>
  );
};
