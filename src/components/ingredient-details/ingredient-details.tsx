import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TIngredient } from '../../utils/types';
import { RootState, AppDispatch } from '../../services/store';
import {
  fetchIngredients,
  fetchIngredientById
} from '../../services/slices/ingredients-slice';
import { IngredientDetailsUI } from '../ui/ingredient-details/ingredient-details';

const IngredientDetails: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id?: string }>();

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  const [ingredient, setIngredient] = useState<TIngredient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIngredient = async () => {
      setLoading(true);
      setError(null);

      if (ingredients.length === 0) {
        await dispatch(fetchIngredients());
      }

      if (id) {
        const found = ingredients.find((it) => it._id === id);
        if (found) {
          setIngredient(found);
          setLoading(false);
        } else {
          const action = await dispatch(fetchIngredientById(id));
          if (fetchIngredientById.fulfilled.match(action)) {
            setIngredient(action.payload);
          } else {
            setError('Ингредиент не найден');
          }
          setLoading(false);
        }
      } else {
        setError('Некорректный id ингредиента');
        setLoading(false);
      }
    };

    loadIngredient();
  }, [ingredients, id, dispatch]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!ingredient) return null;

  return <IngredientDetailsUI ingredientData={ingredient} />;
};

export default IngredientDetails;
