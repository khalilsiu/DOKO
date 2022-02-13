import { useState, MouseEvent, SyntheticEvent, memo, useContext } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import CloseIcon from '@material-ui/icons/Close';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
  withStyles,
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';

import eth from './assets/eth.png';
import facebook from './assets/facebook.png';
import twitter from './assets/twitter.png';
import NoImage from './assets/NoImage.png';
import loading from './assets/loading.gif';
import { Asset } from '../store/meta-nft-collections';
import { AssetForLease } from './landProfile/OwnershipView';
import { useMetaMask } from 'metamask-react';
import LeaseModal from './landProfile/LeaseModal';

interface NFTItemProps {
  nft: Asset & { floorPrice: number };
  onClick?: () => void;
  setSelectedAssetForLease?: (nftInfo: AssetForLease | null) => void;
  selectedAssetForLease?: AssetForLease | null;
}

const LeaseButton = withStyles({
  root: {
    minWidth: '90px',
  },
})(Button);

export const OpenseaNFTItem = memo(
  ({ nft, onClick, setSelectedAssetForLease, selectedAssetForLease }: NFTItemProps) => {
    const history = useHistory();
    const { address: urlAddress } = useParams<{ address: string }>();
    const { status, account: walletAddress } = useMetaMask();
    const styles = useStyles();
    const [shareActive, setShareActive] = useState(false);
    const [error, setError] = useState(false);
    // const [leaseModalOpen, setLeaseModalOpen] = useState(false);
    const nftPath = `/nft/eth/${nft.assetContract.address}/${nft.tokenId}`;

    console.log(status, walletAddress, urlAddress);
    // only decentraland right now
    const showLeaseButton =
      status === 'connected' &&
      walletAddress === urlAddress &&
      (nft.assetContract.address === '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d' ||
        nft.assetContract.address === '0x959e104e1a4db6317fa58f8295f586e1a978c297');

    const share = (event: MouseEvent<HTMLElement>, type: 'facebook' | 'twitter') => {
      event.stopPropagation();
      const url = `${window.origin}${nftPath}`;
      const name = nft.name.replace('#', '');
      const link = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=Check out ${name} on DOKO now!`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=Check out ${name} on @doko_nft now!`,
        instagram: '',
      };
      window.open(link[type], '_blank');
    };

    const onClickCard =
      onClick ||
      (() => {
        history.push(nftPath);
      });

    const handleLeaseBtnClick = (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setSelectedAssetForLease &&
        setSelectedAssetForLease({
          imageOriginalUrl: nft.imageOriginalUrl,
          tokenId: nft.tokenId,
          name: nft.name,
          address: nft.assetContract.address,
        });
    };

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };

    const handleClose = (e: SyntheticEvent) => {
      e.stopPropagation();
      setAnchorEl(null);
    };

    return (
      <>
        <div className={styles.wrapper} onClick={() => onClickCard()}>
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <Grid container alignItems="center" style={{ flex: 1 }}>
                {nft.imageUrl && !error ? (
                  <LazyLoadImage
                    className={styles.image}
                    alt=""
                    width="100%"
                    src={nft.imagePreviewUrl}
                    placeholder={<img src={loading} alt="" />}
                    effect="opacity"
                    onError={() => setError(true)}
                  />
                ) : (
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                    style={{ flex: 1 }}
                    className={styles.image}
                    direction="column"
                  >
                    <img
                      width={60}
                      src={NoImage}
                      style={{ marginBottom: 24 }}
                      alt="Not Available"
                    />
                    {error ? (
                      <div>
                        <Typography className={styles.notAvailableText} gutterBottom variant="h5">
                          Sorry!
                        </Typography>
                        <Typography className={styles.notAvailableText}>
                          Image unavailable
                        </Typography>
                        <Typography className={styles.notAvailableText}>
                          due to host error
                        </Typography>
                      </div>
                    ) : (
                      <Typography className={styles.notAvailableText}>
                        The NFT doesn not have an image
                      </Typography>
                    )}
                  </Grid>
                )}
              </Grid>
            </CardContent>
            <Grid container direction="column" justifyContent="space-between" wrap="nowrap">
              <Box>
                <Typography className={styles.nftName} variant="caption">
                  {nft.name || '-'}
                </Typography>
              </Box>
              <CardActions className={styles.cardActions}>
                <Grid container alignItems="center">
                  <img className={styles.networkIcon} src={eth} alt="ETH" />

                  <Typography style={{ fontWeight: 'bold', color: '#333' }} variant="body2">
                    {nft.floorPrice.toFixed(2) || 'N.A.'}
                  </Typography>
                </Grid>
                <div style={{ display: 'flex' }}>
                  {showLeaseButton && (
                    <div style={{ marginRight: '0.5rem' }}>
                      <LeaseButton
                        className="gradient-button"
                        disabled={false}
                        variant="outlined"
                        style={{ padding: 0 }}
                        onClick={(e) => handleLeaseBtnClick(e)}
                      >
                        <Typography className={styles.leaseBtn} variant="caption">
                          Create Lease
                        </Typography>
                      </LeaseButton>
                    </div>
                  )}
                  <div>
                    <IconButton
                      onMouseEnter={() => setShareActive(true)}
                      onMouseLeave={() => setShareActive(false)}
                      onClick={handleClick}
                      style={{ padding: 0 }}
                    >
                      {shareActive ? (
                        <img
                          className={styles.shareIcon}
                          src="/icons/active-share.png"
                          alt="share"
                        />
                      ) : (
                        <img
                          className={styles.shareIcon}
                          src="/icons/inactive-share.png"
                          alt="share"
                        />
                      )}
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem className={styles.shareItem} onClick={(e) => share(e, 'facebook')}>
                        <img src={facebook} alt="facebook" />
                        Share on Facebook
                      </MenuItem>
                      <MenuItem className={styles.shareItem} onClick={(e) => share(e, 'twitter')}>
                        <img src={twitter} alt="twitter" />
                        Share on Twitter
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              </CardActions>
            </Grid>
          </Card>
        </div>
        {selectedAssetForLease && walletAddress && (
          <LeaseModal
            selectedAssetForLease={selectedAssetForLease}
            setSelectedAssetForLease={setSelectedAssetForLease}
            walletAddress={walletAddress}
            addressConcerned={urlAddress}
          />
        )}
      </>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
    borderRadius: 12,
    backgroundClip: 'padding-box',
    border: 'solid 3px transparent',
    position: 'relative',
    '&:hover': {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background:
          'linear-gradient(-45deg, rgba(63,199,203,1) 0%, rgba(63,199,203,1) 30%, rgba(80,92,176,1) 50%, rgba(148,64,161,1) 80%, rgba(226,69,162,1) 100%)',
        borderRadius: 'inherit',
        margin: -3,
        zIndex: -1,
      },
    },
  },
  card: {
    height: '100%',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    padding: 8,
  },
  cardContent: {
    padding: 0,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 200,
  },
  cardActions: {
    padding: 0,
    marginBottom: '0.5rem',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  nftName: {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#333',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
  },
  leaseBtn: {
    color: theme.palette.primary.main,
  },
  image: {
    borderRadius: 12,
    maxHeight: 400,
    minHeight: 200,
    maxWidth: '100%',
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    '& > svg': {
      width: 'auto',
      height: 'auto',
    },
  },
  networkIcon: {
    width: 12,
    marginRight: 8,
  },
  shareIcon: {
    width: 20,
  },
  shareItem: {
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white',
    },
    '& > img': {
      width: 24,
      marginRight: 12,
    },
  },
  notAvailableText: {
    color: '#b3b3b3',
    textAlign: 'center',
  },
}));

export default OpenseaNFTItem;
