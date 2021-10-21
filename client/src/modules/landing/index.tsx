import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Meta from '../../components/Meta';
import { AuthContext } from '../../contexts/AuthContext';

export const Landing = () => {
  const images = [
    'landing/Ethereum.png',
    'landing/BSC.png',
    'landing/Polygon.png',
    'landing/Solana.png',
    'landing/Ronin.png',
    'landing/Flow.png',
  ];
  // eslint-disable-next-line no-use-before-define
  const styles = useStyles();
  const { connect, loading, address } = useContext(AuthContext);
  const history = useHistory();

  return (
    <>
      <Meta
        title="DOKO, The Multi-Chain NFT Portfolio Manager"
        description="The Multi-Chain NFT Portfolio Manager that allows you to display, manage & trade your NFTs"
        url="https://doko.one"
        image="/DOKO_LOGO.png"
      />
      <Container maxWidth="lg" className={styles.landingTopSection}>
        <h1 className={styles.landingTopTitle}>All Your NFTs in One Place</h1>
        <h3 className={styles.landingTopMiddleText}>
          View your NFT collection for any Ethereum, BSC, Polygon & Solana address under one single
          dashboard
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
        <Container maxWidth="md">
          <Grid wrap="wrap" container alignItems="center" justifyContent="space-evenly">
            {images.map((image) => (
              <Grid item key={image} className={styles.betaSectionImage} sm={2} xs={4}>
                <img src={image} alt="" />
              </Grid>
            ))}
          </Grid>
          {/* <img className="beta-image" src="BetaVersion.png" alt="" /> */}
        </Container>
      </section>

      <section className={styles.whatCanYouDoSection}>
        <div className={styles.whatCanYouDoTextContainer}>
          <div className={styles.highlightText}>What Can You</div>
          <div className={styles.highlightText}>Do With DOKO?</div>
        </div>
        <Grid
          className={styles.whatYouCanDoItem}
          container
          wrap="nowrap"
          alignItems="center"
          justifyContent="flex-start"
          spacing={10}
        >
          <img src="landing/ViewNFTsGraphic.png" alt="" />
          <div>
            <Grid wrap="nowrap" container alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  1
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                View your NFTs across multiple blockchains.
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
          <img className={styles.wereHereImage} src="landing/WereHere.png" alt="" />
          <img src="landing/ShareNFTsGraphic.png" alt="" />
          <div>
            <Grid wrap="nowrap" container alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  2
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                Share to social media conveniently.
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
          <img src="landing/TrendsGraphic.png" alt="" />
          <div>
            <Grid container wrap="nowrap" alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  3
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                Stay updated with market data trends.
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
          <img src="landing/MintBuySellGraphic.png" alt="" />
          <div>
            <Grid wrap="nowrap" container alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  4
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                Mint, buy, sell or transfer directly on DOKO.
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
}));

export default Landing;
