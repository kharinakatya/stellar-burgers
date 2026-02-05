import { FC } from 'react';
import { Button, Input } from '@zlden/react-developer-burger-ui-components';
import styles from './profile.module.css';
import commonStyles from '../common.module.css';
import { ProfileUIProps } from './type';
import { ProfileMenu } from '@components';
export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  updateUserError,
  handleSubmit,
  handleCancel,
  handleInputChange
}) => (
  <main className={`${commonStyles.container}`} data-testid='profile-page'>
    <div className={`mt-30 mr-15 ${styles.menu}`} data-testid='profile-menu'>
      <ProfileMenu />
    </div>
    <form
      className={`mt-30 ${styles.form} ${commonStyles.form}`}
      onSubmit={handleSubmit}
      data-testid='profile-form'
    >
      <>
        <div className='pb-6' data-testid='name-input-container'>
          <Input
            type={'text'}
            placeholder={'Имя'}
            onChange={handleInputChange}
            value={formValue.name}
            name={'name'}
            error={false}
            errorText={''}
            size={'default'}
            icon={'EditIcon'}
            data-testid='name-input'
          />
        </div>
        <div className='pb-6' data-testid='email-input-container'>
          <Input
            type={'email'}
            placeholder={'E-mail'}
            onChange={handleInputChange}
            value={formValue.email}
            name={'email'}
            error={false}
            errorText={''}
            size={'default'}
            icon={'EditIcon'}
            data-testid='email-input'
          />
        </div>
        <div className='pb-6' data-testid='password-input-container'>
          <Input
            type={'password'}
            placeholder={'Пароль'}
            onChange={handleInputChange}
            value={formValue.password}
            name={'password'}
            error={false}
            errorText={''}
            size={'default'}
            icon={'EditIcon'}
            data-testid='password-input'
          />
        </div>
        {isFormChanged && (
          <div className={styles.button} data-testid='profile-buttons'>
            <Button
              type='secondary'
              htmlType='button'
              size='medium'
              onClick={handleCancel}
              data-testid='cancel-button'
            >
              Отменить
            </Button>
            <Button
              type='primary'
              size='medium'
              htmlType='submit'
              data-testid='save-button'
            >
              Сохранить
            </Button>
          </div>
        )}
        {updateUserError && (
          <p
            className={`${commonStyles.error} pt-5 text text_type_main-default`}
            data-testid='profile-error'
          >
            {updateUserError}
          </p>
        )}
      </>
    </form>
  </main>
);
