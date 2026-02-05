import { FC, memo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructor-slice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(
        addIngredient({
          ...ingredient,
          id: uuidv4()
        })
      );
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        handleAdd={handleAdd}
      />
    );
  }
);
