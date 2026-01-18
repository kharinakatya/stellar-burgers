import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '../ui/profile-menu/profile-menu';
import { AppDispatch } from '../../services/store';
import { logout } from '../../services/slices/user-slice';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Ошибка выхода:', err);
      navigate('/');
    }
  };

  return (
    <ProfileMenuUI pathname={location.pathname} handleLogout={handleLogout} />
  );
};
