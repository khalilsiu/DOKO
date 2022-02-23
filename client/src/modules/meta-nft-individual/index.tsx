import { ChangeEvent, useEffect, useState } from 'react';
import {
  Card,
  Button,
  Grid,
  IconButton,
  Link,
  makeStyles,
  Tab,
  Tabs,
  Table,
  TablePagination,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles,
  Hidden,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams } from 'react-router-dom';
import bsc from 'cryptocurrency-icons/32/white/bnb.png';
import solana from 'cryptocurrency-icons/32/white/sol.png';
import eth from '../../assets/eth-small.png';
import { formatTx } from '../../libs/utils';

import Moralis from '../../libs/moralis';
import { fetchOpenSeaEvents } from './api';
import { NftTraits } from './traits';
import { CopyAddress } from './CopyAddress';
import { PopoverShare } from '../../components/PopoverShare';
import opensea_icon from '../../assets/opensea-transparent.png';
import loading_image from '../../assets/loading.gif';
import { Meta } from '../../components';
import Intro from '../core/Intro';

import Decentraland from '../../assets/decentraland.png';
import Cryptovoxels from '../../assets/cryptovoxels.png';
import Somnium from '../../assets/somnium.png';
import Thesandbox from '../../assets/thesandbox.png';
import { fetchAsset } from '../../store/meta-nft-collections';

type Icons = {
  [key: string]: string;
};

const metaverseIcon: Icons = {
  Decentraland,
  Cryptovoxels,
  'somnium-space': Somnium,
  Sandbox: Thesandbox,
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#333333',
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: theme.palette.common.white,
    textAlign: 'center',
  },
}))(TableCell);

const CustomIconButton = withStyles({
  root: {
    padding: '1px',
    marginRight: 24,
  },
})(IconButton);

const CustomTabs = withStyles({
  root: {
    width: '100%',
  },
  flexContainer: {
    borderBottom: '2px solid #46324a',
  },
})(Tabs);

const CustomTab = withStyles({
  root: {
    color: '#FFFFFF',
  },
  wrapper: {
    textTransform: 'none',
  },
})(Tab);

const useStyles = makeStyles((theme) => ({
  collectionContainer: {
    padding: 24,
    marginTop: 36,
    marginBottom: 36,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginTop: 0,
    },
    minHeight: 'calc(100vh)',
  },
  introCard: {
    position: 'sticky',
    top: 120,
    marginRight: '30px',
  },
  nftNameMobile: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      textAlign: 'center',
    },
    display: 'none',
  },
  nftNameGeneral: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
      textAlign: 'left',
    },
    display: 'flex',
  },
  image: {
    borderRadius: 12,
    border: '3px solid white',
    objectFit: 'cover',
    width: '90%',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '0.6em',
      width: '100%',
    },
  },
  separator: {
    border: '1px solid transparent',
    borderRightColor: '#333333',
    [theme.breakpoints.down('md')]: {
      border: '0px',
    },
  },
  bolder: {
    fontWeight: 'bolder',
  },
  shareIcon: {
    width: 36,
    hight: 36,
  },
  networkIcon: {
    width: 12,
    height: 12,
    marginRight: 3,
  },
  networkIconMedium: {
    width: 17,
    height: 34,
  },
  profileButton: {
    background: `linear-gradient(
      -45deg,
      #ff06d7 0%,
      #ff06d7 30%,
      rgba(80, 92, 176, 1) 50%,
      #00ffef 80%,
      #00ffef 100%
    )`,
    padding: '8px 20px',
    width: 250,
    fontWeight: 'bold',
  },
  statsTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
    },
  },
  statsValue: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
  },
}));

export const NftIndividual = () => {
  const styles = useStyles();
  const { address, id, chain } = useParams<{ address: string; id: string; chain: string }>();
  const [tabValue, setTabValue] = useState(0);
  const [txs, setTxs] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const singleAsset = useSelector((state: RootState) => state.singleAsset);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAsset({ asset_contract_address: address, token_id: id }));
  }, [address, id]);

  const getCurrencyIcon = (_chain: string) => {
    let icon;
    switch (_chain) {
      case 'polygon': {
        icon = eth;
        break;
      }
      case 'eth': {
        icon = eth;
        break;
      }
      case 'bsc': {
        icon = bsc;
        break;
      }
      case 'solana': {
        icon = solana;
        break;
      }
      default:
        break;
    }
    return icon;
  };

  const fetchTxs = async (
    _chain: string,
    _address: string,
    _id: string,
    offset: number,
    limit: number,
  ) => {
    let formatted_txs: Array<any> = [];
    try {
      formatted_txs = await fetchOpenSeaEvents(address, id, offset, limit, [
        'created',
        'successful',
        'transfer',
      ]);
      setTxs(formatted_txs);
    } catch (e) {
      setTxs([]);
    }
  };

  useEffect(() => {
    fetchTxs('eth', address, id, 0, 100);
  }, [address, id, chain]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getIndex = (event: string) => {
    switch (event) {
      case 'Listing':
        return 0;
      case 'Sale':
        return 0;
      case 'Bid':
        return 1;
      case 'Transfer':
        return 2;
      default:
        return 0;
    }
  };

  return (
    <>
      <Meta
        title={`${singleAsset.name} | DOKO`}
        description={singleAsset.description || ''}
        url="https://doko.one"
        image={singleAsset.imageUrl || ''}
      />
      <Grid className={styles.collectionContainer} container direction="row" spacing={3}>
        <Hidden smDown>
          <Grid item>
            <Card className={styles.introCard}>
              <Intro drawer={false} />
            </Card>
          </Grid>
        </Hidden>
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          className={styles.nftNameMobile}
        >
          <Grid item>
            <Typography variant="h4" style={{ fontWeight: 'bolder' }}>
              {singleAsset.name}
            </Typography>
          </Grid>
          <Grid item>
            <CustomIconButton onClick={() => window.location.reload()}>
              <img
                className={styles.shareIcon}
                src="/collection/DOKOasset_RefreshData.png"
                alt="back"
              />
            </CustomIconButton>
            <PopoverShare
              address={singleAsset.assetContract.address}
              tokenId={singleAsset.id}
              chain="eth"
              name={singleAsset.name}
            />
          </Grid>
        </Grid>
        <Grid item container direction="column" alignItems="flex-start" md={9} xl={10} spacing={5}>
          <Grid
            item
            container
            direction="row"
            justifyContent="space-between"
            className={styles.nftNameGeneral}
          >
            <Grid item>
              <Typography variant="h2" style={{ fontWeight: 'bolder' }}>
                {singleAsset.name}
              </Typography>
            </Grid>
            <Grid item>
              <CustomIconButton onClick={() => window.location.reload()}>
                <img
                  className={styles.shareIcon}
                  src="/collection/DOKOasset_RefreshData.png"
                  alt="back"
                />
              </CustomIconButton>
              <PopoverShare
                address={singleAsset.assetContract.address}
                tokenId={singleAsset.id}
                chain="eth"
                name={singleAsset.name}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            spacing={3}
            justifyContent="flex-start"
            style={{ paddingTop: '1px' }}
          >
            <Grid item className={styles.separator}>
              <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
                Creator
              </Typography>
              <CopyAddress address={singleAsset.creator} hasLink />
            </Grid>
            <Grid item>
              <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
                Owner
              </Typography>
              <CopyAddress address={singleAsset.owner} hasLink />
            </Grid>
          </Grid>
          <Grid item container direction="row">
            <Grid item md={5} justifyContent="center" alignItems="stretch">
              <img
                key={singleAsset.id}
                className={styles.image}
                alt=""
                src={singleAsset.imageUrl}
              />
            </Grid>
            <Grid item md={7}>
              <Grid item container direction="column" spacing={5}>
                <Grid
                  item
                  container
                  direction="row"
                  spacing={3}
                  justifyContent="flex-start"
                  style={{ paddingTop: '1.8em' }}
                >
                  <Grid item className={styles.separator}>
                    <Grid item>
                      <Typography variant="h6" style={{ fontWeight: 'bolder' }}>
                        Last Purchase Price
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton
                        style={{ padding: 0, verticalAlign: 'baseline', marginRight: 10 }}
                      >
                        <img
                          className={styles.networkIconMedium}
                          src="/collection/DOKOasset_EthereumBlue.png"
                          alt="eth"
                        />
                      </IconButton>
                      <Typography
                        variant="h4"
                        display="inline"
                        className="bolder"
                        style={{
                          marginRight: '4px',
                          fontWeight: 700,
                        }}
                      >
                        {singleAsset.lastSale.toFixed(3)}
                      </Typography>
                      <Typography
                        variant="body1"
                        display="inline"
                        style={{
                          fontSize: '18px',
                          fontStyle: 'italic',
                          marginLeft: '5px',
                        }}
                      >
                        {`($${singleAsset.lastSaleUSD.toFixed(3)})`}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid item>
                      <Typography variant="h6" style={{ fontWeight: 'bolder' }}>
                        Current Floor Price
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton
                        style={{ padding: 0, verticalAlign: 'baseline', marginRight: 10 }}
                      >
                        <img
                          className={styles.networkIconMedium}
                          src="/collection/DOKOasset_EthereumBlue.png"
                          alt="eth"
                        />
                      </IconButton>
                      <Typography
                        variant="h4"
                        display="inline"
                        className="bolder"
                        style={{
                          marginRight: '4px',
                          fontWeight: 700,
                        }}
                      >
                        {parseFloat(`${singleAsset.floorPrice}`).toFixed(2)}
                      </Typography>
                      <Typography
                        variant="body1"
                        display="inline"
                        style={{
                          fontSize: '18px',
                          fontStyle: 'italic',
                          marginLeft: '5px',
                        }}
                      >
                        {`($${singleAsset.floorPriceUSD.toFixed(3)})`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                style={{
                  height: '20px',
                  border: '1px solid transparent',
                  borderBottomColor: '#333333',
                }}
              />
              <Grid item container direction="column" style={{ marginBottom: '1.2em' }}>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 'bolder', marginTop: '0.6em', marginBottom: '0.6em' }}
                >
                  Parcel Stats
                </Typography>
                <NftTraits traits={singleAsset.traits.slice(0, 4)} />
              </Grid>
              <Grid item container wrap="nowrap" justifyContent="space-between" spacing={5}>
                <Grid item container xs={6} direction="column" spacing={3}>
                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 'bolder', marginBottom: '2%' }}
                      className={styles.statsTitle}
                    >
                      Metaverse
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      spacing={1}
                      className={styles.statsValue}
                    >
                      <Hidden smDown>
                        <Grid item>
                          <img width={16} src={metaverseIcon[singleAsset.collection]} alt="" />
                        </Grid>
                        <Grid item>
                          <Typography>{singleAsset.collection}</Typography>
                        </Grid>
                      </Hidden>
                      <Grid item>
                        <Link
                          style={{ textDecoration: 'none', color: '#61dafb' }}
                          href={singleAsset.externalLink}
                        >
                          {`View on ${singleAsset.collection}`}
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 'bolder', marginBottom: '2%' }}
                      className={styles.statsTitle}
                    >
                      Contract Address
                    </Typography>
                    <Typography variant="body1" className={styles.statsValue}>{`${address.substr(
                      0,
                      6,
                    )}...${address.substr(-4)}`}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 'bolder', marginBottom: '2%' }}
                      className={styles.statsTitle}
                    >
                      MarketPlaces
                    </Typography>
                    <Link
                      style={{ textDecoration: 'none' }}
                      target="_blank"
                      href={`https://opensea.io/assets/${address}/${id}`}
                      className={styles.statsValue}
                    >
                      <Button
                        className="gradient-button"
                        variant="outlined"
                        style={{ height: '30px' }}
                      >
                        <img width={16} src={opensea_icon} alt="" />
                        <span style={{ marginLeft: 12 }}>Opensea</span>
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
                <Grid item container direction="column" xs={6} spacing={3}>
                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 'bolder', marginBottom: '2%' }}
                      className={styles.statsTitle}
                    >
                      Token ID
                    </Typography>
                    <Typography variant="body1" className={styles.statsValue}>{`${id.substr(
                      0,
                      6,
                    )}...${id.substr(-4)}`}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 'bolder', marginBottom: '2%' }}
                      className={styles.statsTitle}
                    >
                      Token Standard
                    </Typography>
                    <Typography variant="body1" className={styles.statsValue}>
                      {singleAsset.assetContract.schemaName}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item direction="column">
            <Grid item>
              <Typography
                variant="h5"
                className={styles.bolder}
                style={{ marginTop: '0.6em', marginBottom: '0.6em' }}
              >
                Parcel Transaction History
              </Typography>
            </Grid>
            <CustomTabs
              style={{ marginTop: 12 }}
              indicatorColor="primary"
              textColor="primary"
              value={tabValue}
              onChange={(event, newValue) => setTabValue(newValue)}
            >
              <CustomTab style={{ fontWeight: 'bolder' }} label="Sales" value={0} />
              <CustomTab style={{ fontWeight: 'bolder' }} label="Bids" value={1} />
              <CustomTab style={{ fontWeight: 'bolder' }} label="Transfers" value={2} />
            </CustomTabs>
            <Grid item>
              <TableContainer style={{ maxWidth: '95vw', overflow: 'scroll' }}>
                <Table aria-label="customized table">
                  <TableHead style={{ backgroundColor: '#333333' }}>
                    <TableRow>
                      <StyledTableCell>Event</StyledTableCell>
                      <StyledTableCell>Price</StyledTableCell>
                      <StyledTableCell>From</StyledTableCell>
                      <StyledTableCell>To</StyledTableCell>
                      <StyledTableCell>Date</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {txs
                      .filter((tx) => getIndex(tx.event) === tabValue)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((tx, i) => {
                        const icon = getCurrencyIcon(chain);
                        return (
                          <TableRow key={i}>
                            <StyledTableCell>{tx.event}</StyledTableCell>
                            <StyledTableCell>
                              {tx.price ? (
                                <div>
                                  <img className={styles.networkIcon} src={icon} alt={chain} />
                                  <span>{tx.price}</span>
                                </div>
                              ) : (
                                <div>
                                  <span>{tx.price}</span>
                                </div>
                              )}
                            </StyledTableCell>
                            <StyledTableCell>{tx.from}</StyledTableCell>
                            <StyledTableCell>{tx.to}</StyledTableCell>
                            <StyledTableCell>{tx.date}</StyledTableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={txs.filter((tx) => getIndex(tx.event) === tabValue).length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                style={{ color: 'white' }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default NftIndividual;
