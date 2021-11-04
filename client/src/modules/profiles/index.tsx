/* eslint-disable max-len */
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card,
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  Typography,
  Button,
  Modal,
  OutlinedInput,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import BackIcon from '@material-ui/icons/ArrowBack';
import { useCookies } from 'react-cookie';
import { Meta } from '../../components';
import Intro from '../core/Intro';
import { ProfileItem } from './ProfileItem';

const useStyles = makeStyles((theme) => ({
  collectionPageContainer: {
    padding: '24px',
    marginTop: 36,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    minHeight: 'calc(100vh)',
  },
  introCard: {
    position: 'sticky',
    top: 120,
  },
  itemsContainer: {
    paddingLeft: 36,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
    },
  },
  titleContainer: {
    marginBottom: 12,
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  titleText: {
    fontWeight: 'bolder',
    [theme.breakpoints.down('sm')]: {
      fontSize: 26,
    },
  },
  descriptionText: {
    fontSize: 16,
    [theme.breakpoints.down('sm')]: {
      fontSize: 9,
    },
  },
  createProfileButton: {
    cursor: 'pointer',
    right: '4%',
    width: 162,
    height: 46,
    zIndex: 999,
    position: 'absolute',
  },
  createProfileDialog: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 578,
    height: 320,
    border: '1px solid #FFFFFF',
    background: '#000000',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.75)',
    borderRadius: '23px',
  },
  backButton: {
    cursor: 'pointer',
    border: '2px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '23px',
    marginBottom: 24,
    height: 42,
    width: 110,
  },
}));

export const Profiles = () => {
  const styles = useStyles();
  const [createProfile, setCreateProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [addAddress, setAddAddress] = useState(false);
  const [editProfile, setEditProfile] = useState<any>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['profiles']);

  const handleClickOpen = () => {
    setCreateProfile(true);
  };

  const handleSubmit = () => {
    setCreateProfile(false);
    const profiles = cookies.profiles ? cookies.profiles : [];
    profiles.push({ name: profileName, address: [], hash: 'abc' });
    setCookie('profiles', profiles, { path: '/' });
  };

  const handleClickBack = () => {
    setEditProfile(null);
  };

  const renderProfileList = (profiles: any) => (
    <div>
      <Grid
        className={styles.itemsContainer}
        container
        direction="column"
        alignItems="flex-start"
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          className={styles.titleContainer}
        >
          <Grid item xs={12} md="auto">
            <Grid container direction="column">
              <Typography
                className={styles.titleText}
                variant="h3"
                style={{ fontWeight: 'bolder' }}
              >
                Manage Profile(s)
              </Typography>
            </Grid>
          </Grid>
          <Hidden xsDown>
            <Button className={styles.createProfileButton} onClick={handleClickOpen}>
              <img src="/createProfileButton.png" alt="Create Profile" />
            </Button>
          </Hidden>
        </Grid>
        <Grid
          container
          alignItems="center"
          style={{ paddingBottom: 40 }}
        >
          <Typography
            className={styles.descriptionText}
          >
            This is where you can view, edit or delete each of your created and saved profiles.
          </Typography>
        </Grid>
        <Grid container spacing={3}>
          {profiles && profiles.map(
            (profile: any) => (<ProfileItem
              profile={profile}
              onClickEdit={() => setEditProfile(profile)}
            />),
          )}
        </Grid>
      </Grid>
      <Modal open={createProfile}>
        <div className={styles.createProfileDialog}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{ height: 84 }}
          >
            <Typography variant="h4" style={{ marginLeft: 30, fontSize: 25, fontWeight: 'bold' }}>Create Profile</Typography>
            <IconButton style={{ marginRight: 30 }} onClick={() => { setCreateProfile(false); }}>
              <CloseIcon style={{ fill: '#FFFFFF' }} />
            </IconButton>
          </Grid>
          <hr style={{ width: '100%', margin: 0 }} />
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ height: 122 }}
          >
            <OutlinedInput
              value={profileName}
              onChange={(e) => { setProfileName(e.target.value); }}
              style={{ minWidth: 510, height: 50, fontWeight: 'bold', fontSize: '16px' }}
            />
          </Grid>
          <hr style={{ width: '100%', margin: 0 }} />
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ height: 102 }}
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
    </div>
  );

  const renderEditPage = (profile: any) => (
    <div>
      <Grid
        className={styles.itemsContainer}
        container
        direction="column"
        alignItems="flex-start"
      >
        <Grid item>
          <div onClick={handleClickBack} aria-hidden="true">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              className={styles.backButton}
              spacing={1}
            >
              <Grid item>
                <BackIcon style={{ width: 13, paddingTop: 7, fill: '#FFFFFF' }} />
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: 14, fontWeight: 'bold' }}>Back</Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          className={styles.titleContainer}
        >
          <Grid item xs={12} md="auto">
            <Grid container direction="column">
              <Typography
                className={styles.titleText}
                variant="h3"
                style={{ fontWeight: 'bolder' }}
              >
                {profile.name}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          style={{ paddingBottom: 40 }}
        >
          <Typography
            className={styles.descriptionText}
          >
            This is where you can view, edit or delete each of your profiles. You can only have a maximum of 6 addresses per profile.
          </Typography>
        </Grid>
      </Grid>
      <Modal open={addAddress}>
        <div className={styles.createProfileDialog}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{ height: 84 }}
          >
            <Typography variant="h4" style={{ marginLeft: 30, fontSize: 25, fontWeight: 'bold' }}>Create Profile</Typography>
            <IconButton style={{ marginRight: 30 }} onClick={() => setAddAddress(false)}>
              <CloseIcon style={{ fill: '#FFFFFF' }} />
            </IconButton>
          </Grid>
          <hr style={{ width: '100%', margin: 0 }} />
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ height: 122 }}
          >
            <OutlinedInput
              style={{ minWidth: 510, height: 50, fontWeight: 'bold', fontSize: '16px' }}
            />
          </Grid>
          <hr style={{ width: '100%', margin: 0 }} />
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ height: 102 }}
          >
            <Button
              style={{ width: 170, marginRight: 34 }}
              className="gradient-button"
              variant="outlined"
              onClick={() => setAddAddress(false)}
            >
              Create Profile
            </Button>
          </Grid>
        </div>
      </Modal>
    </div>
  );

  return (
    <>
      <Meta
        title="Manage Profile(s)"
        description="The Multi-Chain NFT Portfolio Manager that allows you to display, manage & trade your NFTs"
        url="https://doko.one"
        image="/DOKO_LOGO.png"
      />
      <Grid container wrap="nowrap" className={styles.collectionPageContainer}>
        <Hidden smDown>
          <Grid item>
            <Card className={styles.introCard}>
              <Intro drawer={false} />
            </Card>
          </Grid>
        </Hidden>
        {!editProfile ? renderProfileList(cookies.profiles) : renderEditPage(editProfile)}
      </Grid>
    </>
  );
};

export default Profiles;
