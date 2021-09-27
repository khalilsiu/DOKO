import { makeStyles, Theme, Modal, Box, Divider } from '@material-ui/core';

interface UIModalProps {
  klasses?: string;
  modalOpen: boolean;
  renderHeader: () => React.ReactNode;
  renderBody: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '500px',
    border: '1px solid white',
    borderRadius: '10px',
    backgroundColor: 'black'
  },
  divider: {
    backgroundColor: 'white',
    height: '1px'
  }
}));

export const UIModal = ({ klasses, modalOpen, renderHeader, renderBody, renderFooter }: UIModalProps) => {
  const classes = useStyles();

  return (
    <Modal open={modalOpen}>
      <Box className={`${classes.modalBox} ${klasses}`}>
        {renderHeader()}
        <Divider className={classes.divider} />
        {renderBody()}
        <Divider className={classes.divider} />
        {renderFooter()}
      </Box>
    </Modal>
  );
};
