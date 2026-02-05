import { FC } from 'react';
import { useDispatch } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '../ui/profile-menu/profile-menu';
import { logout } from '../../services/slices/user-slice';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
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
