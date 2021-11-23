/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import {
  Card,
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  withStyles,
  Button,
  Modal,
  OutlinedInput,
  Checkbox,
} from '@material-ui/core';

import { useCookies } from 'react-cookie';
import { useParams, useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

import { TabPanel, NftPagination, Meta } from '../../components';
import { getAddressStatus, getNFTs, indexAddress } from '../api';
import { Filter } from './Filter';
import Intro from '../core/Intro';
import { isSolAddress, minimizeAddress } from '../../libs/utils';
import { AddressStatus } from './AddressStatus';
import CopyAddress from '../../components/CopyAddress';
import EthNfts from './EthNfts';
import SolNfts from './SolNfts';
import SectionLabel from '../../components/SectionLabel';
import { Summary } from './Summary';

import './select-search.css';

import OpenSeaAPI from '../../libs/opensea-api';
import { getSolNfts } from '../../libs/solana';

import decentraland from './assets/decentraland.png';
import cryptovoxels from './assets/cryptovoxels.png';
import thesandbox from './assets/thesandbox.png';
import somnium from './assets/somnium.png';

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

const CustomIconButton = withStyles({
  disabled: {
    color: '#333 !important',
  },
})(IconButton);

let syncInterval: any;

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

}));

const initialData = [
  {
    icon: decentraland,
    count: 0,
    price: 0,
    name: 'Decentraland',
    available: true,
    loading: true,
  },
  {
    icon: cryptovoxels,
    count: 0,
    price: 0,
    name: 'Cryptovoxels',
    available: true,
    loading: false,
  },
  {
    icon: thesandbox,
    count: 0,
    price: 0,
    name: 'The Sandbox',
    available: true,
    loading: false,
  },
  {
    icon: somnium,
    count: 0,
    price: 0,
    name: 'Somnium Space',
    available: true,
    loading: false,
  },
];

export const NftCollections = () => {
  const [loading, setLoading] = useState(true);
  const [nfts, setNFTs] = useState<any[]>([]);
  const { address } = useParams<{ address: string }>();
  const styles = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [filter, setFilter] = useState<any>({});
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [createProfile, setCreateProfile] = useState(false);
  const isSolana = isSolAddress(address);
  const history = useHistory();

  const [summary, setSummary] = useState(initialData);
  const [ownedEthNfts, setOwnedEthNfts] = useState<any>([]);
  const [ownedEthCollections, setOwnedEthCollections] = useState<any>([]);
  const [ownedSolNfts, setOwnedSolNfts] = useState<any>([]);
  const [ownedSolCollections, setOwnedSolCollections] = useState<any>([]);
  const [ownedBscNfts, setOwnedBscNfts] = useState<any>([]);
  const [eth_loading, setEth_Loading] = useState<boolean>(true);
  const [sol_loading, setSol_Loading] = useState<boolean>(true);
  const [bsc_loading, setBsc_Loading] = useState<boolean>(true);
  const [cookies, setCookie, removeCookie] = useCookies(['profiles']);
  const [profileName, setProfileName] = useState('');

  const collectionFloorPrice: any = {};

  const handleClickOpen = () => {
    setCreateProfile(true);
  };

  const handleSubmit = () => {
    setCreateProfile(false);
    const profiles = cookies.profiles ? cookies.profiles : {};
    profiles[profileName] = { address: [], hash: btoa(JSON.stringify({ name: profileName, address: [] })) };
    setCookie('profiles', profiles, { path: '/' });
    history.push('/profiles');
  };

  const renderAddressList = () => (
    <Hidden xsDown>
      <Grid container direction="row" justifyContent="flex-start">
        <Grid direction="column">
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <img width={20} src="/decentraland.png" alt="decentraland" style={{ borderRadius: '50%', marginRight: 10 }} />
            <Typography
              variant="h3"
              style={{ fontSize: 22, width: 165 }}
            >
              Decentraland
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <img width={20} src="/cryptovoxels.png" alt="cryptovoxels" style={{ borderRadius: '50%', marginRight: 10 }} />
            <Typography
              variant="h3"
              style={{ fontSize: 22, width: 165 }}
            >
              Cryptovoxels
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </Grid>
        </Grid>
        <Grid direction="column">
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <img width={20} src="/thesandbox.png" alt="thesandbox" style={{ borderRadius: '50%', marginRight: 10 }} />
            <Typography
              variant="h3"
              style={{ fontSize: 22, width: 165 }}
            >
              The Sandbox
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <img width={20} src="/somnium.png" alt="somnium" style={{ borderRadius: '50%', marginRight: 10 }} />
            <Typography
              variant="h3"
              style={{ fontSize: 22, width: 165 }}
            >
              Somnium Space
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Hidden>
  );

  useEffect(() => {
    const fetchEthData = async () => {
      initialData[0].loading = true;
      setSummary(initialData);
      const resNfts: any = [];
      if (isSolAddress(address)) {
        setEth_Loading(false);
        return;
      }
      let offset = 0;
      while (1) {
        try {
          const res: any = await OpenSeaAPI.get('/assets', {
            params: {
              limit: 50,
              owner: address,
              offset,
            },
          });
          for (let j = 0; j < res.data.assets.length; j += 1) {
            let asset = {};
            const { slug, name } = res.data.assets[j].collection;
            if (['decentraland, crytpovoxels, somniumn, thesandbox'].filter((s) => s === slug).length === 0) {
              continue;
            }
            if (collectionFloorPrice[name]) {
              asset = {
                ...res.data.assets[j],
                floor_price: collectionFloorPrice[name],
              };
            } else {
              while (1) {
                try {
                  const price_object: any = await OpenSeaAPI.get(`/collection/${slug}/stats`);
                  collectionFloorPrice[name] = price_object.data.stats.floor_price;
                  asset = {
                    ...res.data.assets[j],
                    floor_price: collectionFloorPrice[name],
                  };
                  break;
                } catch (error: any) {
                  break;
                }
              }
            }
            setOwnedEthCollections(Object.keys(collectionFloorPrice).map((s) => ({ value: s, name: s })));
            resNfts.push(asset);
            setOwnedEthNfts([...resNfts]);
            initialData[0].count = resNfts.length;
            initialData[0].price =
              resNfts.map((r: any) => r.floor_price).reduce((a: any, b: any) => a + b, 0);
            setSummary(initialData);
          }
          offset += 50;
          if (res.data.assets.length < 50) {
            break;
          }
        } catch (error: any) {
          break;
        }
      }
      initialData[0].loading = false;
      initialData[0].count = resNfts.length;
      initialData[0].price =
        resNfts.map((res: any) => res.floor_price).reduce((a: any, b: any) => a + b, 0);
      setSummary(initialData);
      setOwnedEthNfts(resNfts);
      setOwnedEthCollections(Object.keys(collectionFloorPrice).map((s) => ({ value: s, name: s })));
      setBsc_Loading(false);
    };
    fetchEthData();
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
                <Grid item>
                  <Hidden xsDown>
                    <Typography
                      style={{ marginLeft: 5, fontFamily: 'Open Sans', fontSize: 12 }}
                    >
                      METAVERSES
                    </Typography>
                  </Hidden>
                </Grid>
                {renderAddressList()}
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
              <CustomTab style={{ fontWeight: 'bolder' }} label="NFT Collection" value={0} />
            </CustomTabs>
          </Grid>
          <TabPanel index={0} value={tabValue}>
            <Summary data={{ summary }} />
            <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
              Decentraland
            </SectionLabel>
            <NftPagination
              loading={bsc_loading}
              nfts={ownedBscNfts.slice((page - 1) * 12, (page) * 12)}
              page={page}
              maxPage={Math.floor(ownedBscNfts.length / 12) + 1}
              onNext={() => setPage(page + 1)}
              onPrev={() => setPage(page - 1)}
            />
            <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
              Cryptovoxels
            </SectionLabel>
            <NftPagination
              loading={bsc_loading}
              nfts={ownedBscNfts.slice((page - 1) * 12, (page) * 12)}
              page={page}
              maxPage={Math.floor(ownedBscNfts.length / 12) + 1}
              onNext={() => setPage(page + 1)}
              onPrev={() => setPage(page - 1)}
            />
            <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
              The Sandbox
            </SectionLabel>
            <NftPagination
              loading={bsc_loading}
              nfts={ownedBscNfts.slice((page - 1) * 12, (page) * 12)}
              page={page}
              maxPage={Math.floor(ownedBscNfts.length / 12) + 1}
              onNext={() => setPage(page + 1)}
              onPrev={() => setPage(page - 1)}
            />
            <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
              Somnium Space
            </SectionLabel>
            <NftPagination
              loading={bsc_loading}
              nfts={ownedBscNfts.slice((page - 1) * 12, (page) * 12)}
              page={page}
              maxPage={Math.floor(ownedBscNfts.length / 12) + 1}
              onNext={() => setPage(page + 1)}
              onPrev={() => setPage(page - 1)}
            />
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
            <Typography variant="h4" style={{ marginLeft: 30, fontSize: 25, fontWeight: 'bold' }}>Create Profile</Typography>
            <IconButton style={{ marginRight: 30 }} onClick={() => { setCreateProfile(false); }}>
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
              onChange={(e) => { setProfileName(e.target.value); }}
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