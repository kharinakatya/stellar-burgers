import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName, isAuth }) => {
  const location = useLocation();
  const isConstructorActive = location.pathname === '/';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <div
            className={`${styles.link} ${styles.link_active}`}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (location.pathname !== '/') {
                window.location.href = '/';
              } else {
                window.location.reload();
              }
            }}
          >
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </div>
          
          {isAuth ? (
            <Link to='/feed' className={styles.link_active}>
              <ListIcon type={'primary'} />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </Link>
          ) : (
            <div className={`${styles.link} ${styles.link}`}>
              <ListIcon type={'primary'} />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </div>
          )}
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          {isAuth ? (
            <Link to='/profile' className={styles.link_active}>
              <ProfileIcon type={'primary'} />
              <p className='text text_type_main-default ml-2'>Личный кабинет</p>
            </Link>
          ) : (
            <div className={`${styles.link} ${styles.link}`}>
              <ProfileIcon type={'primary'} />
              <p className='text text_type_main-default ml-2'>Личный кабинет</p>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
