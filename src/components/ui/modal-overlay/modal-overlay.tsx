import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({
  onClick,
  dataTestId
}: {
  onClick: () => void;
  dataTestId?: string;
}) => (
  <div className={styles.overlay} onClick={onClick} data-testid={dataTestId} />
);
