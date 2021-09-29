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

import { NftTraits } from './traits';
import { web3 } from '../../libs/web3';
import { PopoverShare } from '../../components/PopoverShare';
import { normalizeImageURL, minimizeAddress, chainMapping, formatTx } from '../../libs/utils';
import { getNFT, fetchOpenseaEvents, fetchOpenseaLastSale } from '../api';
import backbutton from '../../assets/back-button.png';
import eth from '../../assets/eth.png';

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
    width: 10,
    marginRight: 3,
    verticalAlign: 'bottom',
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
  const [nftName, setNftName] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const [nftDesc, setNftDesc] = useState<string>('');
  const [txs, setTxs] = useState<any[]>([]);
  const [collection, setCollection] = useState<string>('');
  const [traits, setTraits] = useState<any[]>([]);
  const [, setTotalSupply] = useState<number>();

  // table

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchTxs = async (addr: string, tokenId: string, offset: number, limit: number) => {
    try {
      const res = await fetchOpenseaEvents(addr, tokenId, offset, limit);
      setTxs(res.data.asset_events);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
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
    const res = await axios.get(`https://api.opensea.io/api/v1/asset/${address}/${id}/`);
    setTraits(res.data.traits);
  };

  const getTotalSupply = async (addr: string) => {
    const res = await axios.get(`https://api.opensea.io/api/v1/asset_contract/${addr}`);
    setTotalSupply(res.data.total_supply);
  };

  const fetchNFT = async () => {
    if (!address || !id) {
      return;
    }
    setLoading(true);
    try {
      const res = await getNFT(address, id);
      // eslint-disable-next-line no-underscore-dangle
      const _nft = res.data;
      setNFT([_nft]);
      setOwner(_nft.owner_of);
      setNftName(_nft.metadata.name);
      setNftDesc(_nft.metadata.description);
      setChain(_nft.chain);
      setCollection(_nft.name);
      setAllLoaded(nft.length > 0);
      fetchTxs(address, id, 0, 50);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNFT([]);
    setAllLoaded(false);
    fetchNFT();
    fetchPrice(address, id);
    fetchTraits();
    getTotalSupply(address);
  }, [address, id]);

  return (
    <Grid
      className={styles.collectionContainer}
      container
      direction="row"
      justifyContent="flex-start"
      spacing={2}
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
        {nft.map((item) => (
          <LazyLoadImage
            className={styles.image}
            alt=""
            src={normalizeImageURL(item).metadata.image}
            placeholder={<img src="loading" alt="" />}
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
        spacing={2}
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
        <Grid item container direction="row" spacing={3} justifyContent="flex-start">
          <Grid item>
            <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
              Creator
            </Typography>
            <Typography variant="body1">{minimizeAddress(owner)}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
              Owner
            </Typography>
            <Typography variant="body1">{minimizeAddress(owner)}</Typography>
          </Grid>
        </Grid>
        <Grid item style={{ marginTop: '1.4em' }}>
          <Typography variant="h5" style={{ fontWeight: 'bolder', marginBottom: '0.3em' }}>
            Latest Price
          </Typography>
          <IconButton style={{ padding: 0, verticalAlign: 'middle' }}>
            <img className={styles.networkIcon} src={eth} alt="eth" />
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
        <Grid item>
          <Link
            style={{ textDecoration: 'none' }}
            target="_blank"
            href={`https://opensea.io/assets/${address}/${id}`}
          >
            <Button className={styles.profileButton}>
              <img width={16} src="/CollectionsIcon.png" alt="" />
              <span style={{ marginLeft: 12, color: 'white' }}>View on Opensea</span>
            </Button>
          </Link>
        </Grid>
        <Grid
          item
          container
          wrap="nowrap"
          justifyContent="flex-start"
          spacing={5}
          style={{ marginTop: '0.6em', marginBottom: '0.6em' }}
        >
          <Grid item container xs={6} direction="column" spacing={3}>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
                Description
              </Typography>
              <Typography variant="body1">{nftDesc}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
                Collection
              </Typography>
              <Typography variant="body1">{collection}</Typography>
            </Grid>
          </Grid>
          <Grid item container direction="column" xs={6} spacing={3}>
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
        <Grid item container style={{ marginBottom: '1.2em' }}>
          <Typography variant="h5" style={{ fontWeight: 'bolder', marginBottom: '0.6em' }}>
            Traits
          </Typography>
          <NftTraits traits={traits} />
        </Grid>
        <Grid container item direction="column">
          <Grid item>
            <Typography variant="h5" className="bolder" style={{ marginBottom: '0.6em' }}>
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
                  {txs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((_tx) => {
                    const tx = formatTx(_tx);
                    return (
                      <TableRow key={tx.hash}>
                        <StyledTableCell>{tx.event}</StyledTableCell>
                        <StyledTableCell>
                          {tx.price ? (
                            <div>
                              <img className={styles.networkIcon} src={eth} alt="" />
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
