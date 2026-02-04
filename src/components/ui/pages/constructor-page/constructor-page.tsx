import { FC } from 'react';

import styles from './constructor-page.module.css';

import { ConstructorPageUIProps } from './type';
import { Preloader } from '@ui';
import { BurgerIngredients, BurgerConstructor } from '@components';

export const ConstructorPageUI: FC<ConstructorPageUIProps> = ({
  isIngredientsLoading
}) => (
  <>
    {isIngredientsLoading ? (
      <Preloader />
    ) : (
      <main className={styles.containerMain} data-testid='constructor-page'>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          data-testid='page-title'
        >
          Соберите бургер
        </h1>
        <div className={`${styles.main} pl-5 pr-5`} data-testid='main-content'>
          <BurgerIngredients data-testid='burger-ingredients-section' />
          <BurgerConstructor />
        </div>
      </main>
    )}
  </>
);
