import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Meta from '../../components/Meta';
import { AuthContext } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import metaverses from 'constants/metaverses';
import dashboardIcon from 'assets/app/landing-page/dashboard.png';
import analysisIcon from 'assets/app/landing-page/analysis.png';
import lendingIcon from 'assets/app/landing-page/lending.png';
import rentalIcon from 'assets/app/landing-page/rental.png';
import DOKOLogo from 'assets/doko/doko-logo.png';
import clsx from 'clsx';

export const LandingPage = () => {
  const styles = useStyles();
  const history = useHistory();
  const { connect, address } = useContext(AuthContext);
  const { isLoading } = useSelector((state: RootState) => state.appState);

  return (
    <>
      <Meta
        title="DOKO, Metaverse Real Estate Portfolio Manager"
        description="The Metaverse Real Estate Portfolio Manager that allows you to display, manage and trade your metaverse real estates"
        url="https://doko.one"
        image={DOKOLogo}
      />
      <Container maxWidth="lg" className={styles.landingTopSection}>
        <h1 className={styles.landingTopTitle}>All Your Metaverse Real Estate in One Place</h1>
        <h3 className={styles.landingTopMiddleText}>
          Manage your real estate from supported metaverse under one single dashboard
        </h3>
        <Button
          className={clsx('gradient-button', styles.connectButton)}
          variant="outlined"
          disabled={isLoading}
          onClick={() => (address ? history.push(`/address/${address}`) : connect && connect())}
        >
          {address ? 'Your Profile' : 'Connect Wallet'}
        </Button>
      </Container>

      <section className={styles.betaSection}>
        <Container>
          <Grid wrap="wrap" container alignItems="center" justifyContent="space-evenly">
            {metaverses.map((metaverse) => (
              <Grid item key={metaverse.image} className={styles.betaSectionImage}>
                <img src={metaverse.image} alt="" />
              </Grid>
            ))}
          </Grid>
          {/* <img className="beta-image" src={require('assets/app/beta-version.png')} alt="" /> */}
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
          <div className={styles.whatYouCanDoImage}>
            <img src={dashboardIcon} alt="" />
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
          <div className={styles.whatYouCanDoImage}>
            <img src={analysisIcon} alt="" />
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
          <div className={styles.whatYouCanDoImage}>
            <img src={lendingIcon} alt="" />
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
          <div className={styles.whatYouCanDoImage}>
            <img src={rentalIcon} alt="" />
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
    maxWidth: '80%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      fontSize: 32,
      lineHeight: 1.2,
    },
  },
  connectButton: {
    marginTop: theme.spacing(4),
    minWidth: 160,
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(3),
    },
  },
  landingTopMiddleText: {
    maxWidth: '40%',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      maxWidth: '90%',
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
      marginRight: theme.spacing(2),
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
  whatYouCanDoImage: {
    width: 421,
    height: 421,
    [theme.breakpoints.down('sm')]: {
      width: 'unset',
      height: 340,
      '& > img': {
        maxWidth: 300,
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
    minWidth: '80vw',
  },
}));

export default LandingPage;
