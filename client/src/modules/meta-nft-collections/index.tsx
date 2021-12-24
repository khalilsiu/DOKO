/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { useEffect, useState, useContext } from 'react';
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
} from '@material-ui/core';
import ListIcon from '@material-ui/icons/FormatListBulleted';
import MapIcon from '@material-ui/icons/Map';
import L from 'leaflet';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import metaverses from '../../constants/metaverses';
import { TabPanel, NftPagination, Meta, OpenseaNFTItem } from '../../components';
import Intro from '../core/Intro';
import { minimizeAddress } from '../../libs/utils';
import CopyAddress from '../../components/CopyAddress';
import SectionLabel from '../../components/SectionLabel';
import { Summary } from './Summary';
import './select-search.css';
import { fetchUserOwnership } from '../../store/meta-nft-collections/userOwnershipSlice';
import { fetchCollectionSummary } from '../../store/meta-nft-collections';
import useMetaverseSummaries from '../../hooks/useMetaverseSummaries';
import { CreateProfileContext } from '../../contexts/CreateProfileContext';
import 'leaflet/dist/leaflet.css';

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
  viewButton: {
    cursor: 'pointer',
    width: '81.73px',
    height: '24px',
    left: '705px',
    top: '1560px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxSizing: 'border-box',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTypography: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '10px',
    lineHeight: '14px',
  },
  map: {
    height: 600,
    width: '100%',
    border: '3px solid rgba(255, 255, 255, 0.5)',
    boxSizing: 'border-box',
    borderRadius: '15px',
  },

}));

const maps: any = [];
type Pair<T, K> = [T, K];
const markers: Array<Array<Pair<number, number>>> = [[], [], [], []];

export const NftCollections = () => {
  const { address } = useParams<{ address: string }>();
  const styles = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const { openProfileModal } = useContext(CreateProfileContext);
  const { metaverseSummaries } = useMetaverseSummaries();
  const views = metaverses.map(() => useState('list'));
  const paginations = metaverses.map(() => useState(1));
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    openProfileModal();
  };

  const handleMapViewClick = (nft, index) => () => {
    const address_url = nft.imageOriginalUrl;
    const x_start = address_url.indexOf('x=') + 2;
    const x_end = address_url.indexOf('&');
    const y_start = address_url.indexOf('y=') + 2;
    const coordinate: Pair<number, number> = [parseFloat(address_url.slice(y_start)), parseFloat(address_url.slice(x_start, x_end))];
    maps[index].setView(coordinate, 9);
  };

  function onMapClick(e) {
    // Transform the latitude and longitude of the map to geoX and geoY
    const geoX = Math.round(100 * e.latlng.lng);
    const geoY = Math.round(100 * e.latlng.lat);
  }
  useEffect(() => {
    metaverseSummaries.forEach((metaverse, index) => {
      maps.push(L.map(`${metaverse.name}_map`).setView([1.80, 0.98], 9));
      if (metaverse.name === 'Cryptovoxels') {
        L.tileLayer('https://map.cryptovoxels.com/tile?z={z}&x={x}&y={y}', {
          minZoom: 3,
          maxZoom: 20,
          attribution: 'Map data &copy; Cryptovoxels',
          id: 'cryptovoxels',
        }).addTo(maps[index]);
        maps[index]?.on('click', onMapClick);// Listen to clicks
      }
    });
    dispatch(fetchUserOwnership(address));
    dispatch(fetchCollectionSummary());
  }, [address]);

  useEffect(() => {
    const marker = new L.Icon({
      iconUrl: '/marker.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    metaverseSummaries.forEach((metaverse, index) => {
      metaverse.ownership.forEach((nft: any) => {
        const address_url = nft.imageOriginalUrl;
        const x_start = address_url.indexOf('x=') + 2;
        const x_end = address_url.indexOf('&');
        const y_start = address_url.indexOf('y=') + 2;
        const coordinate: Pair<number, number> = [parseFloat(address_url.slice(y_start)), parseFloat(address_url.slice(x_start, x_end))];
        if (!markers[index].includes(coordinate)) {
          L.marker(coordinate, { icon: marker }).addTo(maps[index]);
          markers[index].push(coordinate);
        }
      });
    });
  }, [metaverseSummaries]);

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
                      {metaverseSummaries.reduce((count, collection) => count + collection.ownership.length, 0)}
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
                        {metaverseSummaries.reduce((floorPrice, collection) => floorPrice + collection.price, 0).toFixed(3)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ChainContainer>
              </Grid>
            </Grid>
            <Summary data={{ summary: metaverseSummaries }} />
            {metaverseSummaries.map((metaverse, index) => {
              const [page, setPage] = paginations[index];
              const [view, setView] = views[index];
              return (
                <div key={metaverse.name}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                    style={{ marginTop: 48, marginBottom: 24 }}
                  >
                    <Grid item>
                      <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
                        {metaverse.name}
                      </SectionLabel>
                    </Grid>
                    <Grid item style={{ marginTop: 48, marginBottom: 24 }}>
                      <span className={styles.viewButton} onClick={() => setView('list')} aria-hidden="true" style={view === 'list' ? { background: 'rgba(255, 255, 255, 0.25)' } : {}}>
                        <ListIcon style={{ fill: '#FFFFFF', fontSize: '14px', margin: '3px' }} />
                        <Typography className={styles.viewTypography}>
                          List View
                        </Typography>
                      </span>
                    </Grid>
                    <Grid item style={{ marginTop: 48, marginBottom: 24 }}>
                      <span className={styles.viewButton} onClick={() => setView('map')} aria-hidden="true" style={view === 'map' ? { background: 'rgba(255, 255, 255, 0.25)' } : {}}>
                        <MapIcon style={{ fill: '#FFFFFF', fontSize: '14px', margin: '3px' }} />
                        <Typography className={styles.viewTypography}>
                          Map View
                        </Typography>
                      </span>
                    </Grid>
                  </Grid>
                  <div key={`${metaverse.name}listview`} style={view === 'list' ? {} : { display: 'none' }}>
                    <NftPagination
                      loading={metaverse.loading}
                      isOpenSea
                      nfts={metaverse.ownership.slice((page - 1) * 5, page * 5)}
                      page={page}
                      maxPage={Math.ceil(metaverse.ownership.length / 5)}
                      onNext={() => setPage(page + 1)}
                      onPrev={() => setPage(page - 1)}
                    />
                  </div>
                  <div key={`${metaverse.name}mapview`} style={view === 'map' ? {} : { display: 'none' }}>
                    <Grid container spacing={1}>
                      <Grid item xs={5}>
                        <Grid container spacing={1} style={{ height: 600, overflowY: 'scroll' }}>
                          {metaverse.ownership.map((nft) => (
                            <Grid item xs={6}>
                              <OpenseaNFTItem key={nft.id} nft={nft} onClick={handleMapViewClick(nft, index)} />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                      <Grid item xs={7}>
                        <div id={`${metaverse.name}_map`} className={styles.map} />
                      </Grid>
                    </Grid>
                  </div>

                </div>
              );
            })}
          </TabPanel>
        </Grid>
      </Grid>
    </>
  );
};

export default NftCollections;
