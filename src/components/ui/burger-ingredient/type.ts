//burger-ingredient/type.ts
import { Location } from 'react-router-dom';
import { TIngredient } from '@utils-types';

// в файле type.ts
export interface TBurgerIngredientUIProps {
  ingredient: TIngredient;
  count?: number;
  handleAdd: () => void; // добавьте это
  locationState?: any;
}
