import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  fetchOrderByNumber,
  clearCurrentOrder
} from '../../services/slices/feeds-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.items);
  const { currentOrder, loading, error } = useSelector((state) => state.feeds);

  const isModal = location.state?.background;

  useEffect(() => {
    if (number) {
      const orderNumber = parseInt(number);
      dispatch(fetchOrderByNumber(orderNumber));
    }

    if (!ingredients || ingredients.length === 0) {
      dispatch(fetchIngredients());
    }

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [number, dispatch, ingredients]);

  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients || ingredients.length === 0) return null;

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const ingredientsArray = Object.values(ingredientsInfo);
    const total = ingredientsArray.reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-default text_color_error'>
        {error}
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div className='text text_type_main-default'>
        Данные заказа не найдены
      </div>
    );
  }

  return (
    <div className={isModal ? '' : 'pt-10'}>
      {!isModal && (
        <div className='text text_type_digits-default text-center mb-6'>
          #{String(currentOrder!.number).padStart(6, '0')}
        </div>
      )}
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
