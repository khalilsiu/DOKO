import { Button, Card, CardContent, makeStyles, Typography, Theme } from '@material-ui/core';
import eth from '../../assets/eth.png';
import { Asset } from '../../store/summary/profileOwnershipSlice';
import ShareButton from '../ShareButton';
import { MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    height: '150px',
    marginBottom: '0.6rem',
    [theme.breakpoints.down('md')]: {
      marginRight: '0.5rem',
      height: '230px',
      flexDirection: 'column',
      width: '170px',
    },
  },
  cardImage: {
    width: '30%',
    backgroundPosition: 'center',
    backgroundSize: '200%',
    [theme.breakpoints.down('md')]: {
      height: '50%',
      width: '100%',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '70%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      padding: '0.6rem',
      '&:last-child': {
        paddingBottom: 0,
      },
    },
  },
  cardTitle: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  leaseLength: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '0.7rem',
    display: 'inline',
  },
  deposit: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      marginBottom: '0.5rem',
    },
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
  },
  cardBottom: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  rent: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    height: '30px',
    width: '100px',
    [theme.breakpoints.down('md')]: {
      width: '80px',
      padding: '0.5rem',
    },
  },
}));

interface ILeaseCard {
  asset: Asset;
  handleClick: () => void;
}

const LeaseCard = ({ asset, handleClick }: ILeaseCard) => {
  const styles = useStyles();
  const history = useHistory();
  const handleBtnClick = (
    e: MouseEvent<HTMLButtonElement>,
    contractAddress: string,
    tokenId: string,
  ) => {
    const leaseDetailUrl = `/rentals/${contractAddress}/${tokenId}/lease`;
    e.stopPropagation();
    history.push(leaseDetailUrl);
  };

  return (
    <Card className={styles.card} onClick={handleClick}>
      <div
        style={{
          backgroundImage: `url('${asset.imageOriginalUrl}')`,
        }}
        className={styles.cardImage}
      ></div>
      <CardContent className={styles.cardContent}>
        <div>
          <div className={styles.cardTitle}>
            <Typography variant="subtitle2" style={{ color: '#333', fontSize: '0.9rem' }}>
              {asset.name}
            </Typography>
            <ShareButton />
          </div>
          <Typography variant="subtitle2" className={styles.leaseLength}>
            Min. {asset.lease?.minLeaseLength}m - Max. {asset.lease?.maxLeaseLength}m
          </Typography>
          <div className={styles.deposit}>
            <Typography
              className={styles.text}
              style={{
                fontSize: '0.7rem',
                marginRight: '0.3rem',
              }}
              variant="body1"
            >
              Deposit
            </Typography>
            <img src={eth} alt="ETH" width="8px" style={{ marginRight: '0.3rem' }} />
            <Typography className={styles.text} style={{ fontSize: '0.7rem' }} variant="body1">
              {asset.lease?.deposit.toFixed(2)}
            </Typography>
          </div>
        </div>

        <div className={styles.cardBottom}>
          <div className={styles.rent}>
            <img src={eth} alt="ETH" width="10px" style={{ marginRight: '0.3rem' }} />
            <Typography className={styles.text} variant="body1">
              {asset.lease?.rentAmount.toFixed(2)}
            </Typography>
          </div>
          <Button
            className={`gradient-button ${styles.button}`}
            variant="outlined"
            onClick={(e) => handleBtnClick(e, asset.assetContract.address, asset.tokenId)}
          >
            <span style={{ fontSize: '0.8rem' }}>Details</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaseCard;
