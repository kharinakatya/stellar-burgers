import React, { FC } from 'react';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '../ui/app-header';

export const AppHeader: FC = () => {
  const isAuth = useSelector((state) => state.user?.isAuth);
  const userName = isAuth ? 'Ваше имя' : '';
  return <AppHeaderUI userName={userName} isAuth={!!isAuth} />;
};

export default AppHeader;
