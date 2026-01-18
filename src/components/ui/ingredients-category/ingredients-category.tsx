import React, { forwardRef } from 'react';
import styles from './ingredients-category.module.css';
import { TIngredientsCategoryUIProps } from './type';
import { BurgerIngredient } from '@components';

export const IngredientsCategoryUI = forwardRef<
  HTMLHeadingElement,
  TIngredientsCategoryUIProps
>(
  (
    { title, titleRef, ingredients, ingredientsCounters, handleAdd },
    ref
  ) => (
    <div className={styles.column}>
      <h2 className='text text_type_main-medium' ref={titleRef}>
        {title}
      </h2>
      <ul className={styles.items}>
        {ingredients.map((ingredient) => (
          <BurgerIngredient
            ingredient={ingredient}
            key={ingredient._id}
            count={ingredientsCounters[ingredient._id]}
            handleAdd={handleAdd}
          />
        ))}
      </ul>
    </div>
  )
);
