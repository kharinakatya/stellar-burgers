import { FC, useState, useEffect, SyntheticEvent, ChangeEvent } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { ProfileUI } from '@ui-pages';
import { updateUser } from '../../services/slices/user-slice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const hasChanges =
        formValue.name !== user.name ||
        formValue.email !== user.email ||
        formValue.password !== '';
      setIsFormChanged(hasChanges);
    }
  }, [formValue, user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const updateData: any = {};
    if (formValue.name !== user?.name) updateData.name = formValue.name;
    if (formValue.email !== user?.email) updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    if (Object.keys(updateData).length > 0) {
      try {
        await dispatch(updateUser(updateData)).unwrap();
        setFormValue({ ...formValue, password: '' });
      } catch (err) {
        console.error('Ошибка обновления профиля:', err);
      }
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error || undefined}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
