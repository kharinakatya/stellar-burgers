import React, { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd }) => {
    const { image, price, name, _id } = ingredient;
    const location = useLocation();

    return (
      <li className={styles.container} data-testid='ingredient-card'>
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={{ background: location }}
          data-testid='ingredient-link'
        >
          {count && <Counter count={count} data-testid='ingredient-counter' />}
          <img
            className={styles.img}
            src={image}
            alt='картинка ингредиента.'
            data-testid='ingredient-image'
          />
          <div
            className={`${styles.cost} mt-2 mb-2`}
            data-testid='ingredient-price'
          >
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p
            className={`text text_type_main-default ${styles.text}`}
            data-testid='ingredient-name'
          >
            {name}
          </p>
        </Link>
        <div
          className={styles.addButtonContainer}
          data-testid='ingredient-add-button'
        >
          <AddButton onClick={handleAdd} />
        </div>
      </li>
    );
  }
);
