import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  makeStyles,
  Typography
} from '@material-ui/core';
import eth from './assets/eth.png';
import bsc from './assets/bsc.png';
import matic from './assets/polygon.png';
import activeShare from './assets/active-share.png';
import inactiveShare from './assets/inactive-share.png';
interface NFTItemProps {
  nft: any;
}

export const NFTItem = ({ nft }: NFTItemProps) => {
  if (nft.metadata?.image?.indexOf('ipfs') === 0) {
    nft.metadata.image = `https://ipfs.io/${nft.metadata.image
      .replace('ipfs/', '')
      .replace('ipfs://', 'ipfs/')}`;
  }
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <Grid container alignItems="center" style={{ flex: 1 }}>
          {nft.metadata.image && (
            <LazyLoadImage className={styles.image} alt="" width="100%" src={nft.metadata?.image} />
          )}
        </Grid>
        <Typography className={styles.nftName} variant="caption">
          {nft.metadata?.name || nft.name || '-'}
        </Typography>
      </CardContent>
      <CardActions className={styles.cardActions}>
        <img
          className={styles.networkIcon}
          width="12px"
          src={{ eth, bsc, matic }[nft.chain as string]}
          alt={nft.chain}
        />
        <IconButton>
          <img className={styles.shareIcon} src={inactiveShare} alt="share" />
          {/* <Share fontSize="small" color="primary" /> */}
        </IconButton>
      </CardActions>
    </Card>
  );
};

const useStyles = makeStyles(() => ({
  card: {
    height: '100%',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    background: 'white'
  },
  cardContent: {
    padding: 6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  cardActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  nftName: {
    fontWeight: 'bold',
    marginLeft: 8,
    color: 'black'
  },
  image: {
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    maxHeight: 400,
    minHeight: 200
  },
  networkIcon: {
    width: 10,
    marginLeft: 8,
    marginBottom: 8
  },
  shareIcon: {
    width: 20
  }
}));
