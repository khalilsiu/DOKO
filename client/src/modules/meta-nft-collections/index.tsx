/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  Typography,
  withStyles,
  Button,
  Modal,
  OutlinedInput,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useParams, useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import metaverses from '../../constants/metaverses';
import { TabPanel, NftPagination, Meta } from '../../components';
import Intro from '../core/Intro';
import { minimizeAddress } from '../../libs/utils';
import CopyAddress from '../../components/CopyAddress';
import SectionLabel from '../../components/SectionLabel';
import { Summary } from './Summary';
import './select-search.css';
import { RootState } from '../../store/store';
import { fetchUserOwnership, Trait } from '../../store/meta-nft-collections/userOwnershipSlice';
import { fetchCollectionSummary } from '../../store/meta-nft-collections';

const CustomTabs = withStyles({
  root: {
    width: '100%',
  },
  flexContainer: {
    borderBottom: '2px solid #46324a',
  },
})(Tabs);

const CustomTab = withStyles({
  wrapper: {
    textTransform: 'none',
  },
})(Tab);

const ChainContainer = withStyles(() => ({
  root: {
    padding: '10px 30px 24px',
    marginTop: 10,
  },
}))(Grid);

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
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
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
  totalSummary: {
    width: '345px',
    height: '99px',
    left: '467px',
    top: '502px',
    background: 'rgba(255,255,255,0.25)',
    borderRadius: '15px',
    marginBottom: '24px',
  },
  summaryLeftDiv: {
    width: '40px',
    height: '99px',
    left: '507px',
    top: '601px',
    background: '#FF06D7',
    borderRadius: '0px 15px 15px 0px',
    transform: 'rotate(-180deg)',
  },
  chainInfo: {
    marginLeft: 48,
  },
}));

export const NftCollections = () => {
  const { address } = useParams<{ address: string }>();
  const styles = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const history = useHistory();

  const [createProfile, setCreateProfile] = useState(false);
  const [cookies, setCookie] = useCookies(['profiles']);
  const [profileName, setProfileName] = useState('');
  const { isLoading: ownershipsIsLoading, ownerships } = useSelector(
    (state: RootState) => state.userOwnership,
  );
  const { isLoading: summaryIsLoading, summaries: collectionSummaries } = useSelector(
    (state: RootState) => state.collectionSummary,
  );
  const paginations = metaverses.map(() => useState(1));
  const dispatch = useDispatch();

  const metaverseSummaries = useMemo(
    () => metaverses.map((metaverse, i) => ({
      ...metaverse,
      isAvailable: collectionSummaries[i].isAvailable,
      traits: metaverse.traits.map((filters, j) => ({
        filters,
        floorPrice: collectionSummaries[i].traits[j].floorPrice,
      })),
    })),
    [collectionSummaries],
  );

  interface Filter {traitType: string; value: any; operator: string ;
  }

  function match(filters: Filter[], trait: Trait) {
    return filters.every((filter) => {
      if (filter.traitType !== trait.traitType) {
        return false;
      }
      if (filter.operator === '=' && filter.value !== trait.value) {
        return false;
      }
      if (filter.operator === '>=' && !(filter.value >= trait.value)) {
        return false;
      }
      if (filter.operator === '<=' && !(filter.value <= trait.value)) {
        return false;
      }
      return true;
    });
  }

  const ownershipsWithFloorPrice = useMemo(
    () => ownerships.map((assets, index) => {
      const metaverseSummary = metaverseSummaries[index];
      return assets.map((asset) => {
        let floorPrice = 0;
        asset.traits.forEach((trait) => {
          metaverseSummary.traits.forEach((traitFilter) => {
            if (!match(traitFilter.filters, trait)) {
              return;
            }
            floorPrice = traitFilter.floorPrice;
          });
        });
        return {
          ...asset,
          floorPrice,
        };
      });
    }),
    [ownerships],
  );

  const summary = useMemo(
    () => metaverseSummaries.map((metaverseSummary, index) => ({
      name: metaverseSummary.label,
      icon: metaverseSummary.icon,
      count: ownershipsWithFloorPrice[index].length,
      price: ownershipsWithFloorPrice[index].reduce((acc, asset) => asset.floorPrice + acc, 0),
      available: metaverseSummary.isAvailable,
      loading: summaryIsLoading || ownershipsIsLoading,
    })),
    [ownershipsIsLoading, ownerships, summaryIsLoading, collectionSummaries],
  );

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
    history.push('/profiles');
  };

  useEffect(() => {
    dispatch(fetchUserOwnership(address));
    dispatch(fetchCollectionSummary());
  }, [address]);

  return (
    <>
      <Meta
        title={`${address} - Profile | DOKO`}
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
            <Grid item xs={12} md="auto">
              <Grid container direction="column" className={styles.addressContainer}>
                <Typography
                  className={styles.addressText}
                  variant="h5"
                  style={{ fontWeight: 'bolder' }}
                >
                  {minimizeAddress(address)}
                </Typography>
                <Grid item>
                  <CopyAddress address={address} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ width: '100%' }}>
            <Hidden xsDown>
              <Button className={styles.createProfileButton} onClick={handleClickOpen}>
                <img src="/createProfileButton.png" alt="Create Profile" />
              </Button>
            </Hidden>
            <CustomTabs
              style={{ marginTop: 12 }}
              indicatorColor="primary"
              textColor="primary"
              value={tabValue}
              onChange={(event, newValue) => setTabValue(newValue)}
            >
              <CustomTab style={{ fontWeight: 'bolder' }} label="Portfolio" value={0} />
            </CustomTabs>
          </Grid>
          <TabPanel index={0} value={tabValue}>
            <Grid className={styles.totalSummary} container direction="row">
              <Grid className={styles.summaryLeftDiv} />
              <Grid>
                <ChainContainer container wrap="nowrap" style={{ flex: 1 }}>
                  <Grid item>
                    <Typography style={{ fontSize: 14 }}>Total Parcels</Typography>
                    <Typography style={{ fontSize: 18, fontWeight: 700 }}>
                      {summary.reduce((a, b) => a + b.count, 0)}
                    </Typography>
                  </Grid>
                  <Grid item className={styles.chainInfo}>
                    <Typography style={{ fontSize: 14 }}>Total Floor Price</Typography>
                    <Grid container alignItems="center">
                      <img
                        style={{ marginRight: 8 }}
                        src="/collection/DOKOasset_EthereumBlue.png"
                        width={10}
                        alt="ETH"
                      />
                      <Typography style={{ fontSize: 18, fontWeight: 700 }}>
                        {summary.reduce((a, b) => a + b.price, 0).toFixed(3)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ChainContainer>
              </Grid>
            </Grid>
            <Summary data={{ summary }} />
            {metaverses.map((metaverse, index) => {
              const [page, setPage] = paginations[index];
              return (
                <div>
                  <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
                    {metaverse.label}
                  </SectionLabel>
                  <NftPagination
                    loading={ownershipsIsLoading}
                    isOpenSea
                    nfts={ownerships[index].slice((page - 1) * 5, page * 5)}
                    page={page}
                    maxPage={Math.floor(ownerships[index].length / 5) + 1}
                    onNext={() => setPage(page + 1)}
                    onPrev={() => setPage(page - 1)}
                  />
                </div>
              );
            })}
          </TabPanel>
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
    </>
  );
};

export default NftCollections;
