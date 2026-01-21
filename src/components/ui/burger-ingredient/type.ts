import { Location } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export interface TBurgerIngredientUIProps {
  ingredient: TIngredient;
  count?: number;
  handleAdd: () => void;
  locationState?: { background: Location };
}
