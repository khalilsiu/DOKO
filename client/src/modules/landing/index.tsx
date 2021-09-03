import { Button, Container, Grid, Typography, makeStyles } from '@material-ui/core';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './index.scss';

export const Landing = () => {
  const images = [
    'landing/Ethereum.png',
    'landing/BSC.png',
    'landing/Polygon.png',
    'landing/Solana.png',
    'landing/Ronin.png',
    'landing/Flow.png'
  ];
  const styles = useStyles();
  const { login, loading, address } = useContext(AuthContext);
  const history = useHistory();

  return (
    <div>
      <Container maxWidth="lg" className="landing-top-section">
        <h1>All Your NFTs in One Place</h1>
        <h3>
          View your NFT collection for any Ethereum, BSC and Polygon address under one single
          dashboard
        </h3>
        <Button
          style={{ marginTop: 24, minWidth: 160 }}
          className="gradient-button"
          variant="outlined"
          disabled={loading}
          onClick={() => (address ? history.push(`/collections/${address}`) : login())}
        >
          {address ? 'Your Profile' : 'Connect Metamask'}
        </Button>
      </Container>

      <section className="beta-section">
        <Container maxWidth="md">
          <Grid container alignItems="center" justifyContent="space-evenly" spacing={2}>
            {images.map(image => (
              <Grid item key={image}>
                <img height={42} src={image} alt="" />
              </Grid>
            ))}
          </Grid>
          {/* <img className="beta-image" src="BetaVersion.png" alt="" /> */}
        </Container>
      </section>

      <section className="what-can-you-do-section">
        <div style={{ margin: '60px 0 80px' }}>
          <div className={styles.highlightText}>What Can You</div>
          <div className={styles.highlightText}>Do With DOKO?</div>
        </div>
        <Grid
          style={{ padding: '0 84px 36px' }}
          container
          wrap="nowrap"
          alignItems="center"
          justifyContent="flex-start"
          spacing={10}
        >
          <img width="25%" src="landing/ViewNFTsGraphic.png" alt="" />
          <Grid style={{ marginLeft: 120 }}>
            <Grid container alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  1
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                View your NFTs across multiple blockchains.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          style={{ padding: '0 84px 36px' }}
          container
          wrap="nowrap"
          alignItems="center"
          justifyContent="center"
          spacing={10}
        >
          <img width="25%" src="landing/ShareNFTsGraphic.png" alt="" />
          <Grid style={{ marginLeft: 80 }}>
            <Grid container alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  2
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                Share to social media conveniently.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          style={{ padding: '0 84px 36px' }}
          container
          wrap="nowrap"
          alignItems="center"
          justifyContent="flex-start"
          spacing={10}
        >
          <img width="25%" src="landing/TrendsGraphic.png" alt="" />
          <Grid style={{ marginLeft: 120 }}>
            <Grid container alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  3
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                Stay updated with market data trends.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          style={{ padding: '0 84px 36px' }}
          container
          wrap="nowrap"
          alignItems="center"
          justifyContent="center"
          spacing={10}
        >
          <img width="25%" src="landing/MintBuySellGraphic.png" alt="" />
          <Grid style={{ marginLeft: 80 }}>
            <Grid container alignItems="center" spacing={6}>
              <Grid item>
                <Typography className={styles.numberText} component="h1" variant="h1">
                  4
                </Typography>
              </Grid>
              <Typography className={styles.description} variant="body1">
                Mint, buy, sell or transfer directly on DOKO.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <div style={{ textAlign: 'center', padding: '84px 0' }}>
          <div className={styles.highlightText}>More Exciting Features</div>
          <div className={styles.highlightText}>to Come!</div>
        </div>
      </section>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  highlightText: {
    fontWeight: 800,
    fontSize: 48,
    color: 'white',
    fontFamily: 'Exo2'
  },
  numberText: {
    fontWeight: 600,
    fontSize: 78,
    color: 'white',
    fontFamily: 'Exo2'
  },
  description: {
    fontWeight: 600,
    fontSize: 22,
    width: 240,
    fontFamily: 'Exo2'
  }
}));
