import { Button, IconButton, makeStyles, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import UIModal from './UIModal';

interface ConfirmModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  headerText: string;
  bodyText: string;
  action: () => void;
}

const useStyles = makeStyles((theme) => ({
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    padding: '1.5rem',
    [theme.breakpoints.down('sm')]: {
      padding: '0.5rem 1.3rem',
    },
    justifyContent: 'space-between',
  },
  modal: {
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
    width: '900px',
  },
  modalContent: {
    padding: '1.5rem',
  },
  actionButton: { marginRight: '0.5rem', width: '110px' },
}));

const ConfirmModal = ({ modalOpen, closeModal, headerText, bodyText, action }: ConfirmModalProps) => {
  const styles = useStyles();

  return (
    <UIModal
      klasses={styles.modal}
      modalOpen={modalOpen}
      renderHeader={() => (
        <div className={styles.modalHeader}>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            {headerText}
          </Typography>
          <IconButton style={{ color: 'white' }} onClick={closeModal}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </div>
      )}
      renderBody={() => (
        <div className={styles.modalContent}>
          <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
            {bodyText}
          </Typography>
        </div>
      )}
      renderFooter={() => (
        <div
          style={{
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button className={`gradient-button ${styles.actionButton}`} variant="contained" onClick={action}>
            Confirm
          </Button>
          <Button className={`gradient-button ${styles.actionButton}`} variant="contained" onClick={closeModal}>
            Cancel
          </Button>
        </div>
      )}
    />
  );
};

export default ConfirmModal;
