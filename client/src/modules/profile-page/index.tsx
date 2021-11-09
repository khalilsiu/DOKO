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
import { useParams } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

import { TabPanel, NftPagination, Meta, RadiusInput } from '../../components';
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
import { PopoverShare } from '../../components/PopoverShare';

import OpenSeaAPI from '../../libs/opensea-api';

import eth from './assets/eth.png';
import bsc from './assets/bsc.png';
import polygon from './assets/polygon.png';
import solana from './assets/solana.png';

type Icons = {
  [key: string]: string
}

const icon: Icons = {
  eth,
  bsc,
  polygon,
  solana,
};

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

const useStyles = makeStyles((theme) => ({
  collectionPageContainer: {
    padding: 24,
    marginTop: 36,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
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
    icon: eth,
    count: 0,
    price: 0,
    name: 'Ethereum',
    available: true,
  },
  {
    icon: bsc,
    count: 0,
    price: 0,
    name: 'BSC',
  },
  {
    icon: polygon,
    count: 0,
    price: 0,
    name: 'Polygon',
  },
  {
    icon: solana,
    count: 0,
    price: 0,
    name: 'Solana',
  },
];

export const NftCollections = () => {
  const [summary, setSummary] = useState(initialData);
  const { hash } = useParams<{ hash: string }>();
  const profile: any = JSON.parse(atob(hash));
  const styles = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [filter, setFilter] = useState<any>({});
  const [page, setPage] = useState(0);
  const [createProfile, setCreateProfile] = useState(false);
  const [ownedEthNfts, setOwnedEthNfts] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  const collectionFloorPrice: any = {};
  const ownedSolanaNfts = {};
  const ownedPolygonNfts = {};

  const handleClickOpen = () => {
    setCreateProfile(true);
  };

  const handleClose = () => {
    setCreateProfile(false);
  };

  const renderAddressList = () => (
    <Hidden xsDown>
      <Grid container direction="row" justifyContent="flex-start">
        <Grid direction="column">
          {profile.address[0] &&
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <img width={20} src={icon[profile.address[0][0]]} alt={profile.address[0][0]} style={{ borderRadius: '50%', marginRight: 10 }} />
            <Typography
              variant="h3"
              style={{ fontSize: 22 }}
            >
              {`${profile.address[0][1].substr(0, 6)}...${profile.address[0][1].substr(-4)}`}
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </Grid>}
          {profile.address[1] &&
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <img width={20} src={icon[profile.address[1][0]]} alt={profile.address[1][0]} style={{ borderRadius: '50%', marginRight: 10 }} />
            <Typography
              variant="h3"
              style={{ fontSize: 22 }}
            >
              {`${profile.address[1][1].substr(0, 6)}...${profile.address[1][1].substr(-4)}`}
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </Grid>}
        </Grid>
        <Grid direction="column">
          {profile.address[2] &&
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <img width={20} src={icon[profile.address[2][0]]} alt={profile.address[2][0]} style={{ borderRadius: '50%', marginRight: 10 }} />
            <Typography
              style={{ fontSize: 22 }}
            >
              {`${profile.address[2][1].substr(0, 6)}...${profile.address[2][1].substr(-4)}`}
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </Grid>}
          {profile.address[3] &&
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <img width={20} src={icon[profile.address[3][0]]} alt={profile.address[3][0]} style={{ borderRadius: '50%', marginRight: 10 }} />
            <Typography
              variant="h3"
              style={{ fontSize: 22 }}
            >
              {`${profile.address[3][1].substr(0, 6)}...${profile.address[3][1].substr(-4)}`}
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </Grid>}
        </Grid>
        <Grid direction="column">
          {profile.address[4] &&
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <img width={20} src={icon[profile.address[4][0]]} alt={profile.address[4][0]} style={{ borderRadius: '50%', marginRight: 10 }} />
            <Typography
              variant="h3"
              style={{ fontSize: 22 }}
            >
              {`${profile.address[4][1].substr(0, 6)}...${profile.address[4][1].substr(-4)}`}
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </Grid>}
          {profile.address[5] &&
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <img width={20} src={icon[profile.address[5][0]]} alt={profile.address[5][0]} style={{ borderRadius: '50%', marginRight: 10 }} />
            <Typography
              variant="h3"
              style={{ fontSize: 22 }}
            >
              {`${profile.address[5][1].substr(0, 6)}...${profile.address[5][1].substr(-4)}`}
            </Typography>
            <Checkbox
              checked
              disabled
              style={{
                color: '#FF06D7',
              }}
            />
          </Grid>}
        </Grid>
      </Grid>
    </Hidden>
  );

  useEffect(() => {
    const fetchData = async () => {
      const resNfts: any = [];
      for (let i = 0; i < profile.address.length; i += 1) {
        let offset = 0;
        while (1) {
          try {
            const res: any = await OpenSeaAPI.get('/assets', {
              params: {
                limit: 50,
                owner: profile.address[i][1],
                offset,
              },
            });
            for (let j = 0; j < res.data.assets.length; j += 1) {
              let asset = {};
              const { slug } = res.data.assets[j].collection;
              if (collectionFloorPrice[slug]) {
                asset = {
                  ...res.data.assets[j],
                  floor_price: collectionFloorPrice[slug],
                };
              } else {
                while (1) {
                  try {
                    const price_object: any = await OpenSeaAPI.get(`/collection/${slug}/stats`);
                    collectionFloorPrice[slug] = price_object.data.stats.floor_price;
                    asset = {
                      ...res.data.assets[j],
                      floor_price: collectionFloorPrice[slug],
                    };
                    break;
                  } catch (error) {
                    continue;
                  }
                }
              }
              resNfts.push(asset);
            }
            setOwnedEthNfts(resNfts);
            if (res.data.assets.length < 50) {
              break;
            }
            offset += 1;
          } catch (error) {
            continue;
          }
        }
      }
      initialData[0].count = resNfts.length;
      initialData[0].price =
        resNfts.map((res: any) => res.floor_price).reduce((a: any, b: any) => a + b);
      setOwnedEthNfts(resNfts);
      setLoading(false);
    };
    fetchData();
  }, [hash]);

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
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            className={styles.addressContainer}
          >
            <Grid item xs={12} sm="auto">
              <Grid container direction="column" className={styles.addressContainer}>
                <Typography
                  className={styles.titleText}
                  variant="h5"
                >
                  {profile.name}
                </Typography>
                <Grid item>
                  <Hidden xsDown>
                    <Typography
                      style={{ marginLeft: 5, fontFamily: 'Open Sans', fontSize: 12 }}
                    >
                      ADDRESSES
                    </Typography>
                  </Hidden>
                </Grid>
                {renderAddressList()}
              </Grid>
            </Grid>
            <Hidden smUp>
              <Grid item justifyContent="center">
                <Button
                  style={{ width: 200 }}
                  className="gradient-button"
                  variant="outlined"
                >
                  {`View Profile Address ${String.fromCharCode(0x25BC)}`}
                </Button>
              </Grid>
            </Hidden>
            <Hidden xsDown>
              <Grid>
                <PopoverShare address={hash} tokenId="test" chain="test" name="test" />
              </Grid>
            </Hidden>
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

            <EthNfts data={{ nfts: ownedEthNfts, loading }} />

            <SolNfts data={{}} />
            <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
              BSC & Polygon NFTs (Beta)
            </SectionLabel>
            <Filter onChange={setFilter} />
            <NftPagination
              nfts={[]}
              page={page}
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
            style={{ height: 84 }}
          >
            <Typography variant="h4" style={{ marginLeft: 30, fontSize: 25, fontWeight: 'bold' }}>Create Profile</Typography>
            <IconButton style={{ marginRight: 30 }} onClick={handleClose}>
              <CloseIcon style={{ fill: '#FFFFFF' }} />
            </IconButton>
          </Grid>
          <hr style={{ width: '100%', margin: 0 }} />
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ height: 122 }}
          >
            <OutlinedInput
              style={{ minWidth: 510, height: 50, fontWeight: 'bold', fontSize: '16px' }}
            />
          </Grid>
          <hr style={{ width: '100%', margin: 0 }} />
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ height: 102 }}
          >
            <Button
              style={{ width: 170, marginRight: 34 }}
              className="gradient-button"
              variant="outlined"
              onClick={handleClose}
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
