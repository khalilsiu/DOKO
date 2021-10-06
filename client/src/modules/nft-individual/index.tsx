import { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  Grid,
  IconButton,
  Link,
  makeStyles,
  Table,
  TablePagination,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import eth from 'cryptocurrency-icons/32/white/eth.png';
import bsc from 'cryptocurrency-icons/32/white/bnb.png';

import Moralis from '../../libs/moralis';
import { NftTraits } from './traits';
import { Rarity } from './rarity';
import { CopyAddress } from './CopyAddress';
import { PopoverShare } from '../../components/PopoverShare';
import { web3 } from '../../libs/web3';
import { normalizeImageURL, chainMapping, formatTx, getTotalSupply } from '../../libs/utils';
import { getNFT, fetchOpenseaEvents, fetchOpenseaLastSale } from '../api';
import backbutton from '../../assets/back-button.png';
import opensea_icon from '../../assets/opensea-transparent.png';
import loading_image from '../../assets/loading.gif';

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
  },
})(IconButton);

const useStyles = makeStyles((theme) => ({
  collectionContainer: {
    padding: 24,
    marginTop: 36,
    marginBottom: 36,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    minHeight: 'calc(100vh)',
  },
  nftData: {
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
    },
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
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    maxHeight: 400,
    minHeight: 200,
    width: '100%',
    '& > svg': {
      width: '100%',
      height: 'auto',
    },
  },
  separator: {
    border: '1px solid transparent',
    borderRightColor: '#333333',
  },
  bolder: {
    fontWeight: 'bolder',
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
  shareIcon: {
    width: 30,
    hight: 30,
  },
  networkIcon: {
    width: 12,
    height: 12,
    marginRight: 3,
  },
  networkIconMedium: {
    width: 18,
    height: 18,
    marginRight: 3,
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
    width: 200,
    fontWeight: 'bold',
  },
}));

export const NftIndividual = () => {
  const styles = useStyles();
  const history = useHistory();

  const { address, id } = useParams<{ address: string; id: string }>();
  const [, setLoading] = useState(false);
  const [, setAllLoaded] = useState(false);
  const [nft, setNFT] = useState<any[]>([]);
  const [lastSale, setLastSale] = useState<number>(0);
  const [lastSaleUSD, setLastSaleUSD] = useState<string>();
  const [owner, setOwner] = useState<string>('');
  const [creator, setCreator] = useState<string>('');
  const [nftName, setNftName] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const [nftDesc, setNftDesc] = useState<string>('');
  const [txs, setTxs] = useState<any[]>([]);
  const [collection, setCollection] = useState<string>('');
  const [traits, setTraits] = useState<any[]>([]);
  const [totalSupply, setTotalSupply] = useState<number>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    let formatted;
    if (_chain === 'polygon' || _chain === 'bsc') {
      const options: any = { address, token_id: id, chain };
      const transfers = await (Moralis.Web3API as any).token.getWalletTokenIdTransfers(options);
      formatted = transfers.result.map((transfer: any) => formatTx(transfer, _chain));
      setTxs(formatted);
    } else {
      try {
        const res = await fetchOpenseaEvents(address, id, offset, limit);
        formatted = res.data.asset_events.map((transfer: any) => formatTx(transfer, chain));
        setTxs(formatted);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
    if (formatted.length) {
      if (formatted[formatted.length - 1].event === 'Mint') {
        setCreator(formatted.at(-1).to);
      }
    } else {
      setCreator('');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchPrice = async (addr: string, tokenId: string) => {
    if (chain !== 'eth') {
      setLastSale(0);
      setLastSaleUSD('0');
      return;
    }
    try {
      const res = await fetchOpenseaLastSale(addr, tokenId);
      const lastsale = res.data.last_sale.total_price
        ? +web3.utils.fromWei(res.data.last_sale.total_price, 'ether')
        : 0;
      const usdRate = +res.data.last_sale.payment_token.usd_price;
      let usdAmount = (lastsale * usdRate).toString();
      usdAmount = Number.parseFloat(usdAmount).toFixed(2);
      setLastSale(lastsale);
      setLastSaleUSD(usdAmount);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const fetchTraits = async () => {
    if (chain === 'matic' || chain === 'bsc') {
      setTraits(nft[0].metadata.attributes || []);
    } else if (chain === 'eth') {
      const res = await axios.get(`https://api.opensea.io/api/v1/asset/${address}/${id}/`);
      setTraits(res.data.traits || []);
    }
  };

  const _getTotalSupply = async (addr: string) => {
    if (chain !== 'eth') {
      setTotalSupply(0);
      return;
    }
    const tsupply = await getTotalSupply(addr);
    setTotalSupply(tsupply);
  };

  const fetchNFT = async () => {
    if (!address || !id) {
      return;
    }
    setLoading(true);
    try {
      const res = await getNFT(address, id);
      const _nft = res.data;
      setNFT([_nft]);
      setOwner(_nft.owner_of);
      setNftName(_nft.metadata.name ? _nft.metadata.name : `${_nft.name} # ${_nft.token_id}`);
      setNftDesc(_nft.metadata.description);
      setChain(_nft.chain);
      setCollection(_nft.name);
      setAllLoaded(nft.length > 0);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNFT([]);
    setAllLoaded(false);
    fetchNFT();
    fetchTxs(chain, address, id, 0, 50);
    fetchPrice(address, id);
    fetchTraits();
    _getTotalSupply(address);
  }, [address, id, chain]);

  return (
    <Grid
      className={styles.collectionContainer}
      container
      direction="row"
      justifyContent="flex-start"
      spacing={4}
    >
      <Grid
        item
        container
        direction="row"
        justifyContent="space-between"
        className={styles.nftNameMobile}
      >
        <Grid item>
          <Typography variant="h4" style={{ fontWeight: 'bolder' }}>
            {nftName}
          </Typography>
        </Grid>
        <Grid item>
          <CustomIconButton>
            <img className={styles.shareIcon} src={backbutton} alt="back" />
          </CustomIconButton>
          <PopoverShare />
        </Grid>
      </Grid>
      <Grid item container xs={12} sm={12} md={4} lg={3} xl={3} justifyContent="flex-start">
        {nft.map((_nft) => (
          <LazyLoadImage
            key={_nft.token_id}
            className={styles.image}
            alt=""
            src={normalizeImageURL(_nft).metadata.image}
            placeholder={<img src={loading_image} alt="Loading" />}
            effect="opacity"
          />
        ))}
      </Grid>
      <Grid
        item
        container
        direction="column"
        alignItems="flex-start"
        xs={12}
        sm={12}
        md={8}
        lg={9}
        xl={9}
        spacing={5}
      >
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          className={styles.nftNameGeneral}
        >
          <Grid item>
            <Typography variant="h4" style={{ fontWeight: 'bolder' }}>
              {nftName}
            </Typography>
          </Grid>
          <Grid item>
            <CustomIconButton onClick={history.goBack}>
              <img className={styles.shareIcon} src={backbutton} alt="back" />
            </CustomIconButton>
            <PopoverShare />
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
          <Grid item className={styles.separator} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
              Creator
            </Typography>
            {creator ? (
              <CopyAddress address={creator} />
            ) : (
              <Typography variant="body1">N/A</Typography>
            )}
          </Grid>
          <Grid item style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
              Owner
            </Typography>
            <CopyAddress address={owner} />
          </Grid>
        </Grid>
        <Grid item container direction="column" spacing={0}>
          <Grid item>
            <Typography variant="h6" style={{ fontWeight: 'bolder' }}>
              Latest Price
            </Typography>
          </Grid>
          {lastSale ? (
            <Grid item>
              <IconButton style={{ padding: 0, verticalAlign: 'baseline' }}>
                <img className={styles.networkIconMedium} src={eth} alt="eth" />
              </IconButton>
              <Typography
                variant="h5"
                display="inline"
                className="bolder"
                style={{ marginRight: '4px' }}
              >
                {lastSale}
              </Typography>
              <Typography variant="body1" display="inline">
                {`(US ${lastSaleUSD})`}
              </Typography>
            </Grid>
          ) : (
            <Grid item>
              <Typography variant="body1">N/A</Typography>
            </Grid>
          )}
          {chain === 'eth' ? (
            <Grid item style={{ marginTop: '7px' }}>
              <Link
                style={{ textDecoration: 'none' }}
                target="_blank"
                href={`https://opensea.io/assets/${address}/${id}`}
              >
                <Button className={styles.profileButton}>
                  <img width={16} src={opensea_icon} alt="" />
                  <span style={{ marginLeft: 12, color: 'white' }}>View on Opensea</span>
                </Button>
              </Link>
            </Grid>
          ) : (
            ''
          )}
        </Grid>

        <Grid item container wrap="nowrap" justifyContent="flex-start" spacing={5}>
          <Grid item container xs={6} direction="column" spacing={1}>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
                Description
              </Typography>
              <Typography variant="body1">{nftDesc || <span>N/A</span>}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
                Collection
              </Typography>
              {chain === 'eth' ? (
                <Link
                  style={{ textDecoration: 'none', color: '#61dafb' }}
                  target="_blank"
                  href={`https://opensea.io/collections/${address}`}
                >
                  {collection}
                </Link>
              ) : (
                <Typography variant="body1">{collection}</Typography>
              )}
            </Grid>
          </Grid>
          <Grid item container direction="column" xs={6} spacing={1}>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
                Contract Address
              </Typography>
              <Typography variant="body1">{address}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
                Blockchain
              </Typography>
              <Typography variant="body1">{chainMapping(chain)}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
                Token ID
              </Typography>
              <Typography variant="body1">{id}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container style={{ flexGrow: 1 }}>
          <Rarity traits={traits} totalSupply={totalSupply} />
        </Grid>
        <Grid item>
          <Typography variant="h5" style={{ fontWeight: 'bolder', marginBottom: '0.6em' }}>
            Traits
          </Typography>
          {traits?.length ? (
            <NftTraits traits={traits} totalSupply={totalSupply} />
          ) : (
            <Typography variant="body1">N/A</Typography>
          )}
        </Grid>
        <Grid container item direction="column">
          <Grid item>
            <Typography variant="h5" className={styles.bolder} style={{ marginBottom: '0.6em' }}>
              Transaction History
            </Typography>
          </Grid>
          <Grid item>
            <TableContainer>
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
                  {txs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tx, i) => {
                    const icon = getCurrencyIcon(chain);
                    return (
                      // eslint-disable-next-line react/no-array-index-key
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
              count={txs.length}
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
  );
};

export default NftIndividual;
