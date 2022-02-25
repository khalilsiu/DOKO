import { Button, Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import eth from '../../assets/eth.png';
import { Asset } from '../../store/summary/profileOwnershipSlice';
import ShareButton from '../ShareButton';
import { MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    height: '150px',
    marginBottom: '0.6rem',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '70%',
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
          width: '30%',
          backgroundImage: `url('${asset.imageOriginalUrl}')`,
          backgroundPosition: 'center',
          backgroundSize: '200%',
        }}
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
              {asset.lease?.deposit}
            </Typography>
          </div>
        </div>

        <div className={styles.cardBottom}>
          <div className={styles.rent}>
            <img src={eth} alt="ETH" width="10px" style={{ marginRight: '0.3rem' }} />
            <Typography className={styles.text} variant="body1">
              {asset.lease?.rentAmount}
            </Typography>
          </div>
          <Button
            className="gradient-button"
            variant="outlined"
            style={{ height: '30px', width: '100px' }}
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
