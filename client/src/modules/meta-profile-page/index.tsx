/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { useEffect, useState, SyntheticEvent, MouseEvent } from 'react';
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
  Checkbox,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { TabPanel, NftPagination, Meta } from '../../components';
import Intro from '../core/Intro';
import { isSolAddress } from '../../libs/utils';
import SectionLabel from '../../components/SectionLabel';
import { Summary } from './Summary';
import { PopoverShare } from '../../components/PopoverShare';

import OpenSeaAPI from '../../libs/opensea-api';
import ContractServiceAPI from '../../libs/contract-service-api';

import decentraland from './assets/decentraland.png';
import cryptovoxels from './assets/cryptovoxels.png';
import thesandbox from './assets/thesandbox.png';
import somnium from './assets/somnium.png';

import eth from './assets/eth.png';
import bsc from './assets/bsc.png';
import polygon from './assets/polygon.png';
import solana from './assets/solana.png';
import { RootState } from '../../store/store';
import { preprocess } from '../../store/meta-nft-collections';

type Icons = {
  [key: string]: string;
};

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

const ChainContainer = withStyles((theme) => ({
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
  xsAddress: {},
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
    loading: true,
  },
  {
    icon: thesandbox,
    count: 0,
    price: 0,
    name: 'The Sandbox',
    available: true,
    loading: true,
  },
  {
    icon: somnium,
    count: 0,
    price: 0,
    name: 'Somnium Space',
    available: true,
    loading: true,
  },
];

export const NftCollections = () => {
  const [summary, setSummary] = useState(initialData);
  const { hash } = useParams<{ hash: string }>();
  const profile: any = JSON.parse(atob(hash));
  const styles = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [filter, setFilter] = useState<any>({});
  const [decentralandPage, setDecentralandPage] = useState(1);
  const [cryptovoxelsPage, setCryptovoxelsPage] = useState(1);
  const [theSandboxPage, setTheSandboxPage] = useState(1);
  const [somniumPage, setSomniumPage] = useState(1);
  const [createProfile, setCreateProfile] = useState(false);
  const [ownedDecentralandNfts, setOwnedDecentralandNfts] = useState<any>([]);
  const [ownedCryptovoxelsNfts, setOwnedCryptovoxelsNfts] = useState<any>([]);
  const [ownedTheSandboxNfts, setOwnedTheSandboxNfts] = useState<any>([]);
  const [ownedSomniumNfts, setOwnedSomniumNfts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['profiles']);
  const [profileName, setProfileName] = useState('');
  const collectionFloorPrice: any = {};

  const handleClickOpen = () => {
    setCreateProfile(true);
  };

  const handleClose = () => {
    setCreateProfile(false);
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

  const renderAddressList = () => (
    <Hidden xsDown>
      <Grid container direction="row" justifyContent="flex-start">
        <Grid direction="column">
          {profile.address[0] && (
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              wrap="nowrap"
            >
              <img
                width={20}
                src={icon[profile.address[0][0]]}
                alt={profile.address[0][0]}
                style={{ borderRadius: '50%', marginRight: 10 }}
              />
              <Typography variant="h3" style={{ fontSize: 22, width: 143 }}>
                {`${profile.address[0][1].substr(0, 6)}...${profile.address[0][1].substr(-4)}`}
              </Typography>
              <Checkbox
                checked
                disabled
                style={{
                  color: '#FF06D7',
                }}
              />
            </Grid>
          )}
          {profile.address[1] && (
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              wrap="nowrap"
            >
              <img
                width={20}
                src={icon[profile.address[1][0]]}
                alt={profile.address[1][0]}
                style={{ borderRadius: '50%', marginRight: 10 }}
              />
              <Typography variant="h3" style={{ fontSize: 22, width: 143 }}>
                {`${profile.address[1][1].substr(0, 6)}...${profile.address[1][1].substr(-4)}`}
              </Typography>
              <Checkbox
                checked
                disabled
                style={{
                  color: '#FF06D7',
                }}
              />
            </Grid>
          )}
        </Grid>
        <Grid direction="column">
          {profile.address[2] && (
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              wrap="nowrap"
            >
              <img
                width={20}
                src={icon[profile.address[2][0]]}
                alt={profile.address[2][0]}
                style={{ borderRadius: '50%', marginRight: 10 }}
              />
              <Typography variant="h3" style={{ fontSize: 22, width: 143 }}>
                {`${profile.address[2][1].substr(0, 6)}...${profile.address[2][1].substr(-4)}`}
              </Typography>
              <Checkbox
                checked
                disabled
                style={{
                  color: '#FF06D7',
                }}
              />
            </Grid>
          )}
          {profile.address[3] && (
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              wrap="nowrap"
            >
              <img
                width={20}
                src={icon[profile.address[3][0]]}
                alt={profile.address[3][0]}
                style={{ borderRadius: '50%', marginRight: 10 }}
              />
              <Typography variant="h3" style={{ fontSize: 22, width: 143 }}>
                {`${profile.address[3][1].substr(0, 6)}...${profile.address[3][1].substr(-4)}`}
              </Typography>
              <Checkbox
                checked
                disabled
                style={{
                  color: '#FF06D7',
                }}
              />
            </Grid>
          )}
        </Grid>
        <Grid direction="column">
          {profile.address[4] && (
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              wrap="nowrap"
            >
              <img
                width={20}
                src={icon[profile.address[4][0]]}
                alt={profile.address[4][0]}
                style={{ borderRadius: '50%', marginRight: 10 }}
              />
              <Typography variant="h3" style={{ fontSize: 22, width: 143 }}>
                {`${profile.address[4][1].substr(0, 6)}...${profile.address[4][1].substr(-4)}`}
              </Typography>
              <Checkbox
                checked
                disabled
                style={{
                  color: '#FF06D7',
                }}
              />
            </Grid>
          )}
          {profile.address[5] && (
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              wrap="nowrap"
            >
              <img
                width={20}
                src={icon[profile.address[5][0]]}
                alt={profile.address[5][0]}
                style={{ borderRadius: '50%', marginRight: 10 }}
              />
              <Typography variant="h3" style={{ fontSize: 22, width: 143 }}>
                {`${profile.address[5][1].substr(0, 6)}...${profile.address[5][1].substr(-4)}`}
              </Typography>
              <Checkbox
                checked
                disabled
                style={{
                  color: '#FF06D7',
                }}
              />
            </Grid>
          )}
        </Grid>
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

  useEffect(() => {
    const fetchEthData = async () => {
      const newData = initialData.map((a) => ({ ...a }));
      setSummary([...newData]);
      const decentralandNfts: any = [];
      setOwnedDecentralandNfts([]);
      const cryptovoxelsNfts: any = [];
      setOwnedCryptovoxelsNfts([]);
      const theSandboxNfts: any = [];
      setOwnedTheSandboxNfts([]);
      const somniumNfts: any = [];
      setOwnedSomniumNfts([]);
      for (let i = 0; i < profile.address.length; i += 1) {
        if (isSolAddress(profile.address[i][1])) continue;
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
            if (!res.data.assets) {
              break;
            }
            for (let j = 0; j < res.data.assets.length; j += 1) {
              let asset: any = {};
              const { slug, name } = res.data.assets[j].collection;
              if (
                ['decentraland', 'cryptovoxels', 'somnium-space', 'sandbox'].indexOf(slug) === -1
              ) {
                continue;
              }
              asset = preprocess(res.data.assets[j]);
              if (slug === 'decentraland') {
                try {
                  const response = await ContractServiceAPI.post('asset/floor-price', {
                    address: '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d',
                    traits: asset.trait,
                  });
                  const { price, payment_token } = response.data;
                  const priceInToken = parseFloat(price);
                  const ethPrice = parseFloat(payment_token.eth_price);
                  asset.floorPrice = (priceInToken * ethPrice) / 10 ** payment_token.decimals;
                } catch (error) {
                  asset.floorPrice = 0;
                }
                decentralandNfts.push(asset);
                setOwnedDecentralandNfts([...decentralandNfts]);
                newData[0].count = decentralandNfts.length;
                newData[0].price += asset.floorPrice;
              }
              if (slug === 'cryptovoxels') {
                try {
                  const response = await ContractServiceAPI.post('asset/floor-price', {
                    address: '0x79986af15539de2db9a5086382daeda917a9cf0c',
                    traits: asset.trait,
                  });
                  const { price, payment_token } = response.data;
                  const priceInToken = parseFloat(price);
                  const ethPrice = parseFloat(payment_token.eth_price);
                  asset.floorPrice = (priceInToken * ethPrice) / 10 ** payment_token.decimals;
                } catch (error) {
                  asset.floorPrice = 0;
                }
                cryptovoxelsNfts.push(asset);
                setOwnedCryptovoxelsNfts([...cryptovoxelsNfts]);
                newData[1].count = cryptovoxelsNfts.length;
                newData[1].price += asset.floorPrice;
              }
              if (slug === 'sandbox') {
                try {
                  const response = await ContractServiceAPI.post('asset/floor-price', {
                    address: '0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a',
                    traits: asset.trait,
                  });
                  const { price, payment_token } = response.data;
                  const priceInToken = parseFloat(price);
                  const ethPrice = parseFloat(payment_token.eth_price);
                  asset.floorPrice = (priceInToken * ethPrice) / 10 ** payment_token.decimals;
                } catch (error) {
                  asset.floorPrice = 0;
                }
                theSandboxNfts.push(asset);
                setOwnedTheSandboxNfts([...theSandboxNfts]);
                newData[2].count = theSandboxNfts.length;
                newData[2].price += asset.floorPrice;
              }
              if (slug === 'somnium-space') {
                try {
                  const response = await ContractServiceAPI.post('asset/floor-price', {
                    address: '0x913ae503153d9a335398d0785ba60a2d63ddb4e2',
                    traits: asset.trait,
                  });
                  const { price, payment_token } = response.data;
                  const priceInToken = parseFloat(price);
                  const ethPrice = parseFloat(payment_token.eth_price);
                  asset.floorPrice = (priceInToken * ethPrice) / 10 ** payment_token.decimals;
                } catch (error) {
                  asset.floorPrice = 0;
                }
                somniumNfts.push(asset);
                setOwnedSomniumNfts([...somniumNfts]);
                newData[3].count = somniumNfts.length;
                newData[3].price += asset.floorPrice;
              }
              setSummary([...newData]);
            }
            if (res.data.assets.length < 50) {
              break;
            }
            offset += 50;
          } catch (error: any) {
            break;
          }
        }
      }
      for (let j = 0; j < 4; j += 1) {
        newData[j].loading = false;
      }
      setSummary([...newData]);
      setLoading(false);
    };
    fetchEthData();
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
            <Grid item xs={12} sm="auto">
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
                {renderAddressList()}
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
                  <MenuItem className={styles.xsAddress}>
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
            <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
              Decentraland
            </SectionLabel>
            <NftPagination
              loading={loading}
              isOpenSea
              nfts={ownedDecentralandNfts.slice((decentralandPage - 1) * 4, decentralandPage * 4)}
              page={decentralandPage}
              maxPage={Math.ceil(ownedDecentralandNfts.length / 4)}
              onNext={() => setDecentralandPage(decentralandPage + 1)}
              onPrev={() => setDecentralandPage(decentralandPage - 1)}
            />
            <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
              Cryptovoxels
            </SectionLabel>
            <NftPagination
              loading={loading}
              isOpenSea
              nfts={ownedCryptovoxelsNfts.slice((cryptovoxelsPage - 1) * 4, cryptovoxelsPage * 4)}
              page={cryptovoxelsPage}
              maxPage={Math.ceil(ownedCryptovoxelsNfts.length / 4)}
              onNext={() => setCryptovoxelsPage(cryptovoxelsPage + 1)}
              onPrev={() => setCryptovoxelsPage(cryptovoxelsPage - 1)}
            />
            <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
              The Sandbox
            </SectionLabel>
            <NftPagination
              loading={loading}
              isOpenSea
              nfts={ownedTheSandboxNfts.slice((theSandboxPage - 1) * 4, theSandboxPage * 4)}
              page={theSandboxPage}
              maxPage={Math.ceil(ownedTheSandboxNfts.length / 4)}
              onNext={() => setTheSandboxPage(theSandboxPage + 1)}
              onPrev={() => setTheSandboxPage(theSandboxPage - 1)}
            />
            <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
              Somnium Space
            </SectionLabel>
            <NftPagination
              loading={loading}
              isOpenSea
              nfts={ownedSomniumNfts.slice((somniumPage - 1) * 4, somniumPage * 4)}
              page={somniumPage}
              maxPage={Math.ceil(ownedSomniumNfts.length / 4)}
              onNext={() => setSomniumPage(somniumPage + 1)}
              onPrev={() => setSomniumPage(somniumPage - 1)}
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
