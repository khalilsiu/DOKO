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
} from '@material-ui/core';
<<<<<<< HEAD
=======
import L from 'leaflet';
>>>>>>> b6f546b (feat: adding profile page)
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import metaverses from '../../constants/metaverses';
<<<<<<< HEAD
import { TabPanel, NftPagination, Meta } from '../../components';
=======
import { Meta } from '../../components';
>>>>>>> b6f546b (feat: adding profile page)
import Intro from '../core/Intro';
import { minimizeAddress } from '../../libs/utils';
import CopyAddress from '../../components/CopyAddress';
import './select-search.css';
import { fetchAddressOwnership } from '../../store/meta-nft-collections/addressOwnershipSlice';
import { fetchCollectionSummary } from '../../store/meta-nft-collections';
import { CreateProfileContext } from '../../contexts/CreateProfileContext';
<<<<<<< HEAD

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
=======
import 'leaflet/dist/leaflet.css';
import useAddressSummaries from '../../hooks/useAddressSummaries';
import OwnershipView from '../../components/ownershipView';
>>>>>>> b6f546b (feat: adding profile page)

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
}));

export const NftCollections = () => {
  const { address } = useParams<{ address: string }>();
  const styles = useStyles();
  const { openProfileModal } = useContext(CreateProfileContext);
  const addressSummaries = useAddressSummaries();
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    openProfileModal();
  };

  function getCoordinates(geoX: number, geoY: number) {
    const coordinates: string[] = [];
    // Checking if geoX is null else if negative -> West, if positive -> Est
    if (geoX !== 0) {
      coordinates.push(geoX < 0 ? `${Math.abs(geoX)}W` : `${geoX}E`);
    }

    // Checking if geoY is null and else if negative -> South, if positive -> North
    if (geoY !== 0) {
      coordinates.push(geoY < 0 ? `${Math.abs(geoY)}S` : `${geoY}N`);
    }
    // Checking if Coordinates are different than 0, and else send the location to the GET url
    if (coordinates.length === 0) {
      return '/';
    }
    return `/?coords=${coordinates.join(',')}`;
  }

  function renderPopUp(nft) {
    return `<div class="container-fluid" style="display:inline-block;"> 
        <div class="title_box" >
          <div class="title_name" style="text-align: left;float:left;">
            ${nft.name}
          </div>
          <div class="title_owner" style="text-align: right;">
          </div>
        </div>
        <div class="title_box" >
          <div class="" style="text-align: left;float:left;">
            ${nft.tokenId}
          </div>
          <div class="collab_box" style="float:right;text-align: right;">
          </div>
        </div>
        <div>
          <img src=${nft.imageUrl} style="width: 150px; height: 150px" />
        </div>
        <div>
          <a href="${`/nft/eth/${nft.assetContract.address}/${nft.tokenId}`}">view</a>
        </div>
      </div>`;
  }

  const handleMapViewClick = (nft, index) => () => {
    const address_url = nft.imageOriginalUrl;
    const x_start = address_url.indexOf('x=') + 2;
    const x_end = address_url.indexOf('&');
    const y_start = address_url.indexOf('y=') + 2;
    if (
      Number.isNaN(parseFloat(address_url.slice(y_start))) ||
      Number.isNaN(parseFloat(address_url.slice(x_start, x_end)))
    )
      return;
    const coordinate: Pair<number, number> = [
      parseFloat(address_url.slice(y_start)),
      parseFloat(address_url.slice(x_start, x_end)),
    ];
    maps[index].setView(coordinate, 9);
    const popupWindow = L.popup();
    popupWindow.setLatLng(coordinate).setContent(renderPopUp(nft)).openOn(maps[index]);
  };

  function onMapClick(e) {
    const geoX = e.latlng.lng;
    const geoY = e.latlng.lat;
  }

  // load address
  useEffect(() => {
    addressSummaries.forEach((metaverse, index) => {
      maps.push(L.map(`${metaverse.name}_map`).setView([1.8, 0.98], 8));
      if (metaverse.name === 'Cryptovoxels') {
        L.tileLayer('https://map.cryptovoxels.com/tile?z={z}&x={x}&y={y}', {
          minZoom: 3,
          maxZoom: 20,
          attribution: 'Map data &copy; Cryptovoxels',
          id: 'cryptovoxels',
        }).addTo(maps[index]);
        maps[index]?.on('click', onMapClick); // Listen to clicks
        setInterval(() => {
          maps[index].invalidateSize();
        }, 1000);
      }
    });
    dispatch(fetchAddressOwnership(address));
    dispatch(fetchCollectionSummary());
  }, [address]);

  // mark nft on map
  useEffect(() => {
    const marker = new L.Icon({
      iconUrl: '/marker.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    addressSummaries.forEach((metaverse, index) => {
      if (metaverse.name === 'Cryptovoxels') {
        metaverse.ownership.forEach((nft: any) => {
          const address_url = nft.imageOriginalUrl;
          const x_start = address_url.indexOf('x=') + 2;
          const x_end = address_url.indexOf('&');
          const y_start = address_url.indexOf('y=') + 2;
          const coordinate: Pair<number, number> = [
            parseFloat(address_url.slice(y_start)),
            parseFloat(address_url.slice(x_start, x_end)),
          ];
          if (!markers[index].includes(coordinate)) {
            L.marker(coordinate, { icon: marker }).addTo(maps[index]);
            markers[index].push(coordinate);
          }
        });
      }
    });
  }, [addressSummaries]);

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
          <OwnershipView metaverseSummaries={addressSummaries} />
        </Grid>
      </Grid>
    </>
  );
};

export default NftCollections;
