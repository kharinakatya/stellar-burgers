import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  createOrder,
  clearConstructor
} from '../../services/slices/constructor-slice';
import { Modal } from '../modal';
import { OrderDetailsUI } from '../ui/order-details';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const orderRequest = useSelector(
    (state) => state.burgerConstructor.orderRequest
  );
  const orderData = useSelector((state) => state.burgerConstructor.orderData);
  const user = useSelector((state) => state.user);

  const onOrderClick = async () => {
    if (!user.isAuth) {
      navigate('/login');
      return;
    }

    if (!bun || ingredients.length === 0) {
      alert('Добавьте булку и начинку для оформления заказа!');
      return;
    }

    if (orderRequest) {
      return;
    }

    try {
      const ingredientIds = [
        bun._id,
        ...ingredients.map((ingredient) => ingredient._id),
        bun._id
      ];

      await dispatch(createOrder(ingredientIds)).unwrap();
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      alert('Не удалось оформить заказа. Попробуйте еще раз.');
    }
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price : 0) * 2 +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <>
      <BurgerConstructorUI
        constructorItems={{ bun, ingredients }}
        orderRequest={orderRequest}
        price={price}
        orderModalData={orderData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
      {orderData && (
        <Modal title='' onClose={closeOrderModal}>
          <OrderDetailsUI orderNumber={orderData.number} />
        </Modal>
      )}
    </>
  );
};
