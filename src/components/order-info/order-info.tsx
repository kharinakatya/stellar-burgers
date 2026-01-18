import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState, AppDispatch } from '../../services/store';
import { getOrderByNumberApi } from '@api';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!number) return;

      try {
        setLoading(true);
        const orderNumber = parseInt(number);
        const response = await getOrderByNumberApi(orderNumber);

        if (response.success && response.orders.length > 0) {
          setOrderData(response.orders[0]);
        } else {
          setError('Заказ не найден');
        }
      } catch (err) {
        setError('Ошибка загрузки данных заказа');
        console.error('Ошибка загрузки заказа:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!ingredients || ingredients.length === 0) {
      dispatch(fetchIngredients());
    }

    fetchOrderData();
  }, [number, dispatch, ingredients]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients || ingredients.length === 0) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
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

    const ingredientsArray = Object.values(ingredientsInfo) as (TIngredient & {
      count: number;
    })[];
    const total = ingredientsArray.reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

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

  return <OrderInfoUI orderInfo={orderInfo} />;
};
