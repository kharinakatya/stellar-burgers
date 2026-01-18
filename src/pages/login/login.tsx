import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { AppDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/user-slice';

export const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email || !password) {
      setErrorText('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/profile');
    } catch (err: any) {
      console.error('Ошибка входа:', err);
      setErrorText(err.message || 'Неверный email или пароль');
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
