/* eslint-disable max-len */
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';
import Meta from '../../components/Meta';
import { AuthContext } from '../../contexts/AuthContext';

export const MetaLanding = () => {
  const images = [
    'meta-landing/decentraland.png',
    'meta-landing/cryptovoxels.png',
    'meta-landing/thesandbox.png',
    'meta-landing/somniumspace.png',

  ];
  // eslint-disable-next-line no-use-before-define
  const styles = useStyles();
  const { connect, loading, address } = useContext(AuthContext);
  const history = useHistory();
  const [snackBar, setSnackBar] = useState(true);
  const handleClose = () => {
    setSnackBar(false);
  };

  const message = (
    <div>
      <Typography>
        {"We are expanding our product offering to metaverse real estate. To visit DOKO's NFT Dashboard, click here to visit "}
        <Link href="https://nft.doko.one" underline="always" style={{ color: '#00b0ff' }}>
          nft.doko.one
        </Link>
      </Typography>

    </div>
  );

  return (
    <>
      <Meta
        title="DOKO, Metaverse Real Estate Portfolio Manager"
        description="The Multi-Chain NFT Portfolio Manager that allows you to display, manage & trade your NFTs"
        url="https://doko.one"
        image="/DOKO_LOGO.png"
      />
      <Container maxWidth="lg" className={styles.landingTopSection}>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={snackBar}
          onClose={handleClose}
          className={styles.snackBar}
        >
          <SnackbarContent
            style={{ width: '100%' }}
            message={message}
          />
        </Snackbar>
        <h1 className={styles.landingTopTitle}>All Your Digital Real Estate in One Place</h1>
        <h3 className={styles.landingTopMiddleText}>
          Manage your digital real estate from supported metaverse under one single dashboard
        </h3>
        <Button
          style={{ marginTop: 48, minWidth: 160 }}
          className="gradient-button"
          variant="outlined"
          disabled={loading}
          onClick={() => (address ? history.push(`/address/${address}`) : connect())}
        >
          {address ? 'Your Profile' : 'Connect Wallet'}
        </Button>
      </Container>

      <section className={styles.betaSection}>
        <Container>
          <Grid wrap="wrap" container alignItems="center" justifyContent="space-evenly">
            {images.map((image) => (
              <Grid item key={image} className={styles.betaSectionImage}>
                <img src={image} alt="" />
              </Grid>
            ))}
          </Grid>
          {/* <img className="beta-image" src="BetaVersion.png" alt="" /> */}
        </Container>
      </section>

      <section className={styles.whatCanYouDoSection}>
        <div className={styles.whatCanYouDoTextContainer}>
          <div className={styles.highlightText}>DOKO Features</div>
        </div>
        <Grid
          className={styles.whatYouCanDoItem}
          container
          wrap="nowrap"
          alignItems="center"
          justifyContent="flex-start"
          spacing={10}
        >
          <div style={{ width: 421, height: 421 }}>
            <img src="meta-landing/dashboard.png" alt="" />
          </div>
          <div>
            <Grid wrap="nowrap" container alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  1
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                All Your Digital Real Estate Under One Single Dashboard
              </Typography>
            </Grid>
          </div>
        </Grid>
        <Grid
          className={styles.whatYouCanDoItem}
          container
          wrap="nowrap"
          alignItems="center"
          justifyContent="center"
          spacing={10}
        >
          <div style={{ width: 421, height: 421 }}>
            <img src="meta-landing/analysis.png" alt="" />
          </div>
          <div>
            <Grid wrap="nowrap" container alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  2
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                Real-Time Market Analysis at Your Fingertips (Coming Soon!)
              </Typography>
            </Grid>
          </div>
        </Grid>
        <Grid
          className={styles.whatYouCanDoItem}
          container
          wrap="nowrap"
          alignItems="center"
          justifyContent="flex-start"
          spacing={10}
        >
          <div style={{ width: 421, height: 421 }}>
            <img src="meta-landing/lending.png" alt="" />
          </div>
          <div>
            <Grid container wrap="nowrap" alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  3
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                Real Estate Collateralized P2P Lending (Coming Soon!)
              </Typography>
            </Grid>
          </div>
        </Grid>
        <Grid
          className={styles.whatYouCanDoItem}
          container
          wrap="nowrap"
          alignItems="center"
          justifyContent="center"
          spacing={10}
        >
          <div style={{ width: 421, height: 421 }}>
            <img src="meta-landing/rental.png" alt="" />
          </div>
          <div>
            <Grid wrap="nowrap" container alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  4
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                Non-Custodial Real Estate Rental (Coming Soon!)
              </Typography>
            </Grid>
          </div>
        </Grid>
        <div style={{ textAlign: 'center', padding: '84px 0' }}>
          <div className={styles.highlightText}>More Exciting Features</div>
          <div className={styles.highlightText}>to Come!</div>
        </div>
      </section>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  landingTopSection: {
    textAlign: 'center',
    color: 'white',
    height: 'calc(100vh - 75px)',
    display: 'flex !important',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100vh - 150px)',
    },
  },
  landingTopTitle: {
    fontSize: 64,
    fontFamily: 'Exo2',
    marginTop: 0,
  },
  landingTopMiddleText: {
    maxWidth: '50%',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  highlightText: {
    fontWeight: 800,
    fontSize: 48,
    color: 'white',
    fontFamily: 'Exo2',
    [theme.breakpoints.down('sm')]: {
      fontSize: 32,
    },
  },
  numberText: {
    fontWeight: 600,
    fontSize: 78,
    color: 'white',
    fontFamily: 'Exo2',
  },
  description: {
    fontWeight: 600,
    fontSize: 22,
    width: 240,
    fontFamily: 'Exo2',
    [theme.breakpoints.down('xs')]: {
      width: 'unset',
    },
  },
  betaSection: {
    background: '#ffffff',
    padding: '64px 0',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
  },
  betaSectionImage: {
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
    },
  },
  whatCanYouDoSection: {
    padding: 48,
    fontFamily: 'Exo2',
    [theme.breakpoints.down('sm')]: {
      padding: 24,
    },
  },
  whatYouCanDoItem: {
    padding: '0 84px 36px',
    position: 'relative',
    '& > img': {
      [theme.breakpoints.down('sm')]: {
        width: '300px',
      },
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: 0,
      margin: 0,
      width: '100%',
      paddingBottom: 48,
      alignItems: 'start',
      '& > div': {
        marginLeft: 0,
      },
    },
  },
  whatCanYouDoTextContainer: {
    marginBottom: 84,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 48,
    },
  },
  wereHereImage: {
    width: '80px !important',
  },
  snackBar: {
    width: '70vw',
    bottom: '10%',
  },
}));

export default MetaLanding;
