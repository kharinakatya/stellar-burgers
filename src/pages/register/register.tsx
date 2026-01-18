import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../services/slices/user-slice';
import { AppDispatch } from '../../services/store';

export const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleRegister = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        registerUser({ email, name: userName, password })
      ).unwrap();
      navigate('/profile');
    } catch (err) {
      if (err instanceof Error) {
        setErrorText(err.message);
      } else {
        setErrorText('Произошла ошибка при регистрации');
      }
    }
  };

  const isFormValid =
    userName.trim() !== '' && email.trim() !== '' && password.trim() !== '';

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleRegister}
      isButtonDisabled={!isFormValid}
    />
  );
};
