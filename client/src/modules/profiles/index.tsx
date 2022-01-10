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
import { AddToHomeScreenTwoTone } from '@material-ui/icons';
import { Meta } from '../../components';
import Intro from '../core/Intro';
import { ProfileItem } from './ProfileItem';
import eth from './assets/eth.png';
import bsc from './assets/bsc.png';
import polygon from './assets/polygon.png';
import solana from './assets/solana.png';

type Icons = {
  [key: string]: string;
};

const icon: Icons = {
  eth,
  bsc,
  polygon,
  solana,
};

const useStyles = makeStyles((theme) => ({
  collectionPageContainer: {
    padding: '24px',
    marginTop: 36,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginTop: 0,
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
      marginTop: 0,
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
  connectedAddress: {
    fontSize: 32,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
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
    maxHeight: '90vh',
    maxWidth: '90vw',
    width: 578,
    height: 320,
    border: '1px solid #FFFFFF',
    background: '#000000',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.75)',
    borderRadius: '23px',
  },
  addAddressDialog: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '90%',
    maxWidth: '90%',
    minHeight: 600,
    overflowY: 'hidden',
    width: 645,
    height: 627,
    border: '1px solid #FFFFFF',
    background: '#000000',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.75)',
    borderRadius: '23px',
    display: 'block',
  },
  typeButton: {
    cursor: 'pointer',
    margin: 10,
    border: '1px solid #FFFFFF',
    borderRadius: '10px',
    height: 126,
    width: 126,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      height: 68,
      width: 68,
    },
  },
  typeButtonOutlined: {
    cursor: 'pointer',
    margin: 10,
    border: '1px solid #FF06D7',
    borderRadius: '10px',
    height: 126,
    width: 126,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      height: 68,
      width: 68,
    },
  },
  typeImg: {
    width: 26,
    height: 26,
    [theme.breakpoints.down('sm')]: {
      width: 14,
      height: 14,
    },
  },
  typeText: {
    marginTop: 3,
    fontWeight: 'bold',
    fontSize: 12,
    [theme.breakpoints.down('sm')]: {
      fontSize: 8,
    },
  },
  backButton: {
    cursor: 'pointer',
    border: '2px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '23px',
    marginBottom: 24,
    height: 42,
    width: 110,
  },
  buttons: {
    height: 50,
    border: '2px solid rgba(255, 255, 255, 0.5)',
    boxSizing: 'border-box',
    borderRadius: '100px',
    width: '100%',
    alignItems: 'center',
  },
}));

export const Profiles = () => {
  const styles = useStyles();
  const [createProfile, setCreateProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [addAddress, setAddAddress] = useState(false);
  const [editProfile, setEditProfile] = useState<string>('');
  const [addressType, setAddressType] = useState('eth');
  const [newAddress, setNewAddress] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['profiles']);

  const handleClickOpen = () => {
    setCreateProfile(true);
  };

  const handleSubmit = () => {
    setCreateProfile(false);
    const profiles = cookies.profiles ? cookies.profiles : {};
    profiles[profileName] = {
      address: [],
      hash: btoa(JSON.stringify({ name: profileName, address: [] })),
    };
    setCookie('profiles', profiles, { path: '/' });
  };

  const handleDeleteProfile = (name: string) => {
    const profiles = cookies.profiles ? cookies.profiles : {};
    delete profiles[name];
    setCookie('profiles', profiles, { path: '/' });
  };

  const handleDeleteAddress = (address: string) => {
    const profiles = cookies.profiles ? cookies.profiles : {};
    profiles[editProfile].address = profiles[editProfile].address.filter(
      (adrs: any) => adrs[1] !== address,
    );
    profiles[editProfile].hash = btoa(
      JSON.stringify({ name: editProfile, address: profiles[editProfile].address }),
    );
    setCookie('profiles', profiles, { path: '/' });
  };

  const handleClickBack = () => {
    setEditProfile('');
  };

  const onClickSave = () => {
    setAddAddress(false);
    setNewAddress('');
    const profiles = cookies.profiles ? cookies.profiles : {};
    if (profiles[editProfile].address.length < 6) {
      profiles[editProfile].address.push([addressType, newAddress]);
      profiles[editProfile].hash = btoa(
        JSON.stringify({ name: editProfile, address: profiles[editProfile].address }),
      );
      setCookie('profiles', profiles, { path: '/' });
    }
  };

  const renderProfileList = () => (
    <div>
      <Grid className={styles.itemsContainer} container direction="column" alignItems="flex-start">
        <Hidden smUp>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            wrap="nowrap"
          >
            <IconButton onClick={handleClickOpen}>
              <img src="/createProfileIcon.png" alt="share" />
            </IconButton>
          </Grid>
        </Hidden>
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
        <Grid container alignItems="center" style={{ paddingBottom: 40 }}>
          <Typography className={styles.descriptionText}>
            This is where you can view, edit or delete each of your created and saved profiles.
          </Typography>
        </Grid>
        <Grid container spacing={3}>
          {cookies.profiles &&
            Object.keys(cookies.profiles).map((name: string) => (
              <ProfileItem
                profile={name}
                onClickEdit={() => setEditProfile(name)}
                onClickDelete={() => handleDeleteProfile(name)}
              />
            ))}
        </Grid>
      </Grid>
      <Modal open={createProfile}>
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
                setCreateProfile(false);
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
    </div>
  );

  const renderEditPage = () => (
    <div>
      <Grid className={styles.itemsContainer} container direction="column" alignItems="flex-start">
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
                {editProfile}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container alignItems="center" style={{ paddingBottom: 40 }}>
          <Typography className={styles.descriptionText}>
            This is where you can view, edit or delete each of your profiles. You can only have a
            maximum of 6 addresses per profile.
          </Typography>
        </Grid>
        <Grid container alignItems="center" style={{ paddingBottom: 20 }}>
          <Typography className={styles.connectedAddress}>
            {`Address Connected (${cookies.profiles?.[editProfile].address.length})`}
          </Typography>
        </Grid>
        {cookies.profiles?.[editProfile].address.length < 6 && (
          <Grid container>
            <Button className={styles.buttons} onClick={() => setAddAddress(true)}>
              <img src="/addAddress.png" alt="add address" />
            </Button>
          </Grid>
        )}
        {cookies.profiles?.[editProfile].address.map((adrs: any) => (
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            wrap="nowrap"
            className={styles.buttons}
            style={{ marginTop: 10 }}
          >
            <img
              width={20}
              src={icon[adrs[0]]}
              alt={adrs[0]}
              style={{ borderRadius: '50%', margin: '3%' }}
            />
            <Typography noWrap style={{ fontSize: '18px', fontFamily: 'Open Sans' }}>
              {adrs[1]}
            </Typography>
            <Button
              style={{ width: 100, height: '50%', margin: '3%' }}
              className="gradient-button"
              variant="outlined"
              onClick={() => handleDeleteAddress(adrs[1])}
            >
              Delete
            </Button>
          </Grid>
        ))}
      </Grid>
      <Modal open={addAddress}>
        <div className={styles.addAddressDialog}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{ height: '12%' }}
          >
            <Typography variant="h4" style={{ marginLeft: 30, fontSize: 25, fontWeight: 'bold' }}>
              Add an Address
            </Typography>
            <IconButton style={{ marginRight: 30 }} onClick={() => setAddAddress(false)}>
              <CloseIcon style={{ fill: '#FFFFFF' }} />
            </IconButton>
          </Grid>
          <hr style={{ width: '100%', margin: 0 }} />
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            style={{ padding: 30, height: '74%' }}
          >
            <Typography style={{ fontSize: 21 }}>Select Blockchain</Typography>
            <Typography style={{ fontSize: 14 }}>
              Select the type of address that you want to add to the profile.
            </Typography>
            <Grid container direction="row">
              <div
                onClick={() => setAddressType('eth')}
                aria-hidden="true"
                className={addressType === 'eth' ? styles.typeButtonOutlined : styles.typeButton}
              >
                <div style={{ marginTop: '30%' }}>
                  <img className={styles.typeImg} src={eth} alt="EVM" />
                  <Typography className={styles.typeText}>EVM</Typography>
                </div>
              </div>
              <div
                onClick={() => setAddressType('solana')}
                aria-hidden="true"
                className={addressType === 'solana' ? styles.typeButtonOutlined : styles.typeButton}
              >
                <div style={{ marginTop: '30%' }}>
                  <img className={styles.typeImg} src={solana} alt="SOL" />
                  <Typography className={styles.typeText}>Solana</Typography>
                </div>
              </div>
            </Grid>
            <Typography style={{ fontSize: 21, marginTop: 15 }}>Enter your address</Typography>
            <Typography style={{ fontSize: 14 }}>
              Enter the address that you want to add to the profile
            </Typography>
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <OutlinedInput
                value={newAddress}
                onChange={(e) => {
                  setNewAddress(e.target.value);
                }}
                style={{
                  marginTop: 30,
                  width: '90%',
                  height: 50,
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              />
            </Grid>
          </Grid>
          <hr style={{ width: '100%', margin: 0 }} />
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ height: '12%' }}
          >
            <Button
              style={{ width: 170, marginRight: 34 }}
              className="gradient-button"
              variant="outlined"
              onClick={onClickSave}
            >
              Save
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
        {!editProfile ? renderProfileList() : renderEditPage()}
      </Grid>
    </>
  );
};

export default Profiles;
