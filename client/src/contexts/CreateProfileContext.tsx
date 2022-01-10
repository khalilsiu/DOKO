import {
  makeStyles,
  Modal,
  Grid,
  Typography,
  IconButton,
  OutlinedInput,
  Button,
} from '@material-ui/core';
import { createContext, PropsWithChildren, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
  createProfileDialog: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '90vh',
    maxWidth: '90vw',
    width: 578,
    height: 320,
    border: '1px solid #FFFFFF',
    background: '#000000',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.75)',
    borderRadius: '23px',
  },
}));

interface CreateProfileContextValue {
  openProfileModal: () => void;
}

export const CreateProfileContext = createContext<CreateProfileContextValue>({
  openProfileModal: () => null,
});

export const CreateProfileContextProvider = ({ children }: PropsWithChildren<any>) => {
  const history = useHistory();
  const styles = useStyles();
  const [profileName, setProfileName] = useState('');
  const [cookies, setCookie] = useCookies(['profiles']);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const handleSubmit = () => {
    setOpenProfileModal(false);
    const profiles = cookies.profiles ? cookies.profiles : {};
    profiles[profileName] = {
      address: [],
      hash: btoa(JSON.stringify({ name: profileName, address: [] })),
    };
    setCookie('profiles', profiles, { path: '/' });
    history.push('/profiles');
  };
  return (
    <CreateProfileContext.Provider value={{ openProfileModal: () => setOpenProfileModal(true) }}>
      <>
        {children}
        <Modal open={openProfileModal}>
          <div className={styles.createProfileDialog}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              style={{ height: '24%' }}
            >
              <Typography variant="h4" style={{ marginLeft: 30, fontSize: 25, fontWeight: 'bold' }}>
                Create Profile
              </Typography>
              <IconButton
                style={{ marginRight: 30 }}
                onClick={() => {
                  setOpenProfileModal(false);
                }}
              >
                <CloseIcon style={{ fill: '#FFFFFF' }} />
              </IconButton>
            </Grid>
            <hr style={{ width: '100%', margin: 0 }} />
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{ height: '52%' }}
            >
              <OutlinedInput
                value={profileName}
                onChange={(e) => {
                  setProfileName(e.target.value);
                }}
                style={{ minWidth: '90%', height: 50, fontWeight: 'bold', fontSize: '16px' }}
              />
            </Grid>
            <hr style={{ width: '100%', margin: 0 }} />
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              style={{ height: '24%' }}
            >
              <Button
                style={{ width: 170, marginRight: 34 }}
                className="gradient-button"
                variant="outlined"
                onClick={handleSubmit}
              >
                Create Profile
              </Button>
            </Grid>
          </div>
        </Modal>
      </>
    </CreateProfileContext.Provider>
  );
};
