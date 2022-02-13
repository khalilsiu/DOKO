import { useEffect, useState, SyntheticEvent, MouseEvent, useContext } from 'react';
import {
  Card,
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  Typography,
  Button,
  Checkbox,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { Meta } from '../../components';
import Intro from '../core/Intro';
import { PopoverShare } from '../../components/PopoverShare';
import { useDispatch } from 'react-redux';
import eth from '../../assets/eth-small.png';
import bsc from '../../assets/bsc-small.png';
import polygon from '../../assets/polygon-small.png';
import solana from '../../assets/solana-small.png';
import { fetchCollectionSummary, fetchProfileOwnership } from '../../store/meta-nft-collections';
import OwnershipView from '../../components/landProfile/OwnershipView';
import useProfileSummaries from '../../hooks/useProfileSummaries';
import { CreateProfileContext } from '../../contexts/CreateProfileContext';

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
    padding: 24,
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
    },
  },
  titleText: {
    fontWeight: 'bolder',
    width: '80%',
    fontSize: 55,
    [theme.breakpoints.down('sm')]: {
      fontSize: 26,
    },
  },
  nftsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridAutoRows: '1fr',
    columnGap: 12,
    rowGap: 12,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
  addressContainer: {
    marginBottom: 12,
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  addressText: {
    fontWeight: 'bolder',
    [theme.breakpoints.down('xs')]: {
      fontSize: 30,
    },
  },
  addressRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  addressAndShareButton: { display: 'flex', width: '100%', justifyContent: 'space-between' },
}));

export const NftCollections = () => {
  const { hash } = useParams<{ hash: string }>();
  const profile: any = JSON.parse(atob(hash));
  const styles = useStyles();
  const profileSummaries = useProfileSummaries();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useDispatch();
  const { openProfileModal } = useContext(CreateProfileContext);

  const handleClickOpen = () => {
    openProfileModal();
  };

  interface TypedAddress {
    type: 'eth' | 'sol';
    address: string;
  }

  const typedAddresses = profile.address.map((typedAddress) => ({
    type: typedAddress[0],
    address: typedAddress[1],
  }));

  const renderAddressList = (addresses: TypedAddress[]) => (
    <Hidden xsDown>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        style={{ width: '60%' }}
      >
        {addresses.map((typedAddress) => (
          <div className={styles.addressRow}>
            <img
              width={20}
              src={icon[typedAddress.type]}
              alt={typedAddress.address}
              style={{ borderRadius: '50%', marginRight: 10 }}
            />
            <Typography variant="h3" style={{ fontSize: 22, width: 143 }}>
              {`${typedAddress.address.substr(0, 6)}...${typedAddress.address.substr(-4)}`}
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </div>
        ))}
      </Grid>
    </Hidden>
  );

  const handleOpenAddress = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAddress = (e: SyntheticEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const addresses = profile.address.map((address) => address[1]);
  useEffect(() => {
    dispatch(fetchProfileOwnership(addresses));
    dispatch(fetchCollectionSummary());
  }, []);

  return (
    <>
      <Meta
        title={`${profile.name} - Profile | DOKO`}
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
        <Grid
          className={styles.itemsContainer}
          container
          direction="column"
          alignItems="flex-start"
        >
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
            className={styles.addressContainer}
          >
            <Grid item xs={12} sm="auto" style={{ width: '100%' }}>
              <Grid container direction="column" className={styles.addressContainer}>
                <Typography className={styles.titleText} variant="h5" noWrap>
                  {profile.name}
                </Typography>
                <Grid item>
                  <Hidden xsDown>
                    <Typography style={{ marginLeft: 5, fontFamily: 'Open Sans', fontSize: 12 }}>
                      ADDRESSES
                    </Typography>
                  </Hidden>
                </Grid>
                <div className={styles.addressAndShareButton}>
                  {renderAddressList(typedAddresses)}
                  <Hidden xsDown>
                    <Grid>
                      <PopoverShare address={hash} tokenId="test" chain="test" name="test" />
                    </Grid>
                  </Hidden>
                </div>
              </Grid>
            </Grid>
            <Hidden smUp>
              <Grid item justifyContent="center">
                <Button
                  style={{ width: 200 }}
                  className="gradient-button"
                  variant="outlined"
                  onClick={handleOpenAddress}
                >
                  {`View Profile Address ${String.fromCharCode(0x25bc)}`}
                </Button>
              </Grid>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseAddress}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                {profile.address.map((adrs: any) => (
                  <MenuItem>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-start"
                      wrap="nowrap"
                    >
                      <img
                        width={20}
                        src={icon[adrs[0]]}
                        alt={adrs[1]}
                        style={{ borderRadius: '50%', marginRight: 10 }}
                      />
                      <Typography variant="h3" style={{ fontSize: 22, color: '#000000' }}>
                        {`${adrs[1].substr(0, 6)}...${adrs[1].substr(-4)}`}
                      </Typography>
                      <Checkbox
                        checked
                        disabled
                        style={{
                          color: '#FF06D7',
                        }}
                      />
                    </Grid>
                  </MenuItem>
                ))}
              </Menu>
            </Hidden>
          </Grid>
          <OwnershipView metaverseSummaries={profileSummaries} />
        </Grid>
      </Grid>
    </>
  );
};

export default NftCollections;
