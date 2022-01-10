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
  Hidden,
} from '@material-ui/core';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams } from 'react-router-dom';
import bsc from 'cryptocurrency-icons/32/white/bnb.png';
import solana from 'cryptocurrency-icons/32/white/sol.png';
import eth from './assets/eth.png';

import Moralis from '../../libs/moralis';
import { fetchOpenSeaEvents, fetchNFTOpensea } from './api';
import { NftTraits } from './traits';
import { SolanaNftTraits } from './solanaTraits';
import { CopyAddress } from './CopyAddress';
import { PopoverShare } from '../../components/PopoverShare';
import { web3 } from '../../libs/web3';
import { normalizeImageURL, chainMapping, formatTx, getTotalSupply } from '../../libs/utils';
import { getNFT, fetchOpenseaLastSale } from '../api';
import { getTokenInfo, getSolanaNFTMetadata, getTokenOwner } from '../../libs/metaplex/utils';
import opensea_icon from '../../assets/opensea-transparent.png';
import loading_image from '../../assets/loading.gif';
import { Meta } from '../../components';

import decentraland from './assets/decentraland.png';
import cryptovoxels from './assets/cryptovoxels.png';
import somnium from './assets/somnium.png';
import thesandbox from './assets/thesandbox.png';
import metaverses from '../../constants/metaverses';
import { Filter } from '../../hooks/useProfileSummaries';
import ContractServiceAPI from '../../libs/contract-service-api';
import { parsePrice } from '../../store/meta-nft-collections/collectionSummarySlice';

type Icons = {
  [key: string]: string;
};

const metaverseIcon: Icons = {
  decentraland,
  cryptovoxels,
  'somnium-space': somnium,
  sandbox: thesandbox,
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
  lazyloadwrapper: {
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
      left: 0,
    },
    textAlign: 'center',
    width: 'inherit',
    maxWidth: 'inherit',
  },
  image: {
    borderRadius: 12,
    border: '3px solid white',
    maxHeight: 400,
    minHeight: 200,
    maxWidth: '80%',
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
    width: 250,
    fontWeight: 'bold',
  },
}));

export const NftIndividual = () => {
  const styles = useStyles();
  const { address, id, chain } = useParams<{ address: string; id: string; chain: string }>();
  const [nft, setNFT] = useState<any>();
  const [lastSale, setLastSale] = useState<number>();
  const [lastSaleUSD, setLastSaleUSD] = useState<number>();
  const [floorPrice, setFloorPrice] = useState<number>();
  const [owner, setOwner] = useState<string>('');
  const [creator, setCreator] = useState<string>('');
  const [nftName, setNftName] = useState<string>('');
  const [nftImage, setNftImage] = useState<string>('');
  const [nftDesc, setNftDesc] = useState<string>('');
  const [txs, setTxs] = useState<any[]>([]);
  const [collection, setCollection] = useState<string>('');
  const [traits, setTraits] = useState<any[]>([]);
  const [totalSupply, setTotalSupply] = useState<number>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [slug, setSlug] = useState<string>('');
  const [externalLink, setExternalLink] = useState<string>('');
  const [metaverseName, setMetaverseName] = useState<string>('');

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

  const fetchNFT = async () => {
    if (!address || !id) {
      return;
    }

    try {
      let _nft;
      let _metadata;
      if (chain === 'solana') {
        const res: any = await getTokenInfo(id);
        const metadataRes: any = await getSolanaNFTMetadata(res);
        const tokenOwner: any = await getTokenOwner(id);
        _nft = res.data;
        _metadata = metadataRes.metadata.data;
        if (_nft.creators) {
          setCreator(_nft.creators[0].address);
        }
        setNFT(_nft);
        setOwner(tokenOwner);
        setNftName(_nft.name);
        setNftImage(_metadata.image);
        setNftDesc(_metadata.description);
        setCollection(_metadata.symbol);
        const _traits = 'attributes' in _metadata ? _metadata.attributes : [];
        setTraits(_traits);
      } else if (chain !== 'eth') {
        const res = await getNFT(address, id);
        _nft = res.data;
        setNFT(_nft);
        setOwner(_nft.owner_of);
        setNftName(_nft.metadata.name ? _nft.metadata.name : `${_nft.name} # ${_nft.token_id}`);
        setNftImage(normalizeImageURL(_nft).metadata.image);
        setNftDesc(_nft.metadata.description);
        setCollection(_nft.name);
        const _traits =
          'metadata' in _nft && 'attributes' in _nft.metadata ? _nft.metadata.attributes : [];
        setTraits(_traits);
      } else {
        const res = await fetchNFTOpensea(address, id);
        _nft = res.data;
        setNFT(_nft);
        setOwner(_nft.owner.address);
        setNftName(_nft.name ? _nft.name : 'N/A');
        setNftImage(_nft.image_url);
        setNftDesc(_nft.description);
        setCollection(_nft.asset_contract.name);
        const _traits = res.data.traits && res.data.traits.length ? res.data.traits : [];
        let traitFilter: Filter[] = [];
        // just for a quick fix...
        const metaverse = metaverses.find((metaverse) => _nft.collection.slug === metaverse.slug);
        if (metaverse) {
          const lookupTraits = _traits.filter((trait) =>
            metaverse.primaryTraitTypes.includes(trait.trait_type),
          );
          traitFilter = lookupTraits.map((trait) => ({
            traitType: trait.trait_type,
            value: trait.value,
            operator: '=',
          }));
          const response: any = await ContractServiceAPI.getAssetFloorPrice(
            metaverse.primaryAddress,
            traitFilter,
          );
          let floorPrice = parsePrice(response.price, response.payment_token);
          if (_nft.asset_contract.address === '0x959e104e1a4db6317fa58f8295f586e1a978c297') {
            const sizeTrait = _nft.traits.find((trait) => trait.trait_type === 'Size');
            console.log(sizeTrait);

            const size = parseInt((sizeTrait && sizeTrait.value) || '1', 10);
            floorPrice *= size;
          }
          setFloorPrice(floorPrice);
        }
        setSlug(_nft.collection.slug);
        switch (_nft.collection.slug) {
          case 'decentraland':
            setMetaverseName('Decentraland');
            break;
          case 'cryptovoxels':
            setMetaverseName('Cryptovoxels');
            break;
          case 'somnium-space':
            setMetaverseName('Somnium Space');
            break;
          case 'sandbox':
            setMetaverseName('The Sandbox');
            break;
          default:
            break;
        }
        setExternalLink(_nft.external_link);
        setTraits(_traits);
      }
    } catch (err) {
      if (err) console.log(err);
    }
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
      if (_chain === 'solana') {
        return;
      }
      if (_chain !== 'eth') {
        const options: any = { address, token_id: id, chain };
        const transfers = await (Moralis.Web3API as any).token.getWalletTokenIdTransfers(options);
        formatted_txs = transfers.result.map((transfer: any) => formatTx(transfer, _chain));
      } else {
        formatted_txs = await fetchOpenSeaEvents(address, id, offset, limit, [
          'created',
          'successful',
          'transfer',
        ]);
      }
      setTxs(formatted_txs);
    } catch (e) {
      console.log(e);
      setTxs([]);
    }
    if (formatted_txs.length) {
      if (formatted_txs[formatted_txs.length - 1].event === 'Mint') {
        setCreator(formatted_txs[formatted_txs.length - 1].to);
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
      setLastSaleUSD(0);
      setFloorPrice(0);
      return;
    }
    try {
      const res = await fetchOpenseaLastSale(addr, tokenId);
      const isLastSale = res.data.last_sale && res.data.last_sale.total_price;
      const lastsale = isLastSale
        ? +web3.utils.fromWei(res.data.last_sale.total_price, 'ether')
        : 0;
      const usdRate = isLastSale ? +res.data.last_sale.payment_token.usd_price : 0;
      let usdAmount = lastsale * usdRate;
      usdAmount = +Number.parseFloat(usdAmount.toString()).toFixed(2);
      const _floorPrice = +res.data.collection.stats.floor_price;
      setLastSale(lastsale);
      setLastSaleUSD(usdAmount);
    } catch (e) {
      console.error(e);
    }
  };

  const _getTotalSupply = async (addr: string) => {
    if (chain !== 'eth') {
      setTotalSupply(0);
      return;
    }
    try {
      const tsupply = await getTotalSupply(addr);
      setTotalSupply(tsupply);
    } catch (e) {
      setTotalSupply(0);
    }
  };

  useEffect(() => {
    setNFT([]);
    fetchNFT();
    fetchTxs(chain, address, id, 0, 100);
    fetchPrice(address, id);
    _getTotalSupply(address);
    console.log(externalLink);
  }, [address, id, chain]);

  return (
    <>
      {nft && (
        <Meta
          title={`${nftName} | DOKO`}
          description={nftDesc || ''}
          url="https://doko.one"
          image={nftImage || ''}
        />
      )}
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
            <CustomIconButton onClick={() => window.location.reload()}>
              <img
                className={styles.shareIcon}
                src="/collection/DOKOasset_RefreshData.png"
                alt="back"
              />
            </CustomIconButton>
            <PopoverShare address={address} tokenId={id} chain={chain} name={nftName} />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={12}
          sm={12}
          md={4}
          lg={3}
          xl={3}
          justifyContent="flex-start"
          style={{ position: 'relative' }}
        >
          {nft && (
            <LazyLoadImage
              style={{ textAlign: 'center' }}
              key={nft.token_id}
              className={styles.image}
              wrapperClassName={styles.lazyloadwrapper}
              alt=""
              src={nftImage}
              placeholder={<img src={loading_image} alt="Loading" />}
              effect="opacity"
            />
          )}
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
              <CustomIconButton onClick={() => window.location.reload()}>
                <img
                  className={styles.shareIcon}
                  src="/collection/DOKOasset_RefreshData.png"
                  alt="back"
                />
              </CustomIconButton>
              <PopoverShare address={address} tokenId={id} chain={chain} name={nftName} />
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
                <CopyAddress address={creator} hasLink={false} />
              ) : (
                <Typography variant="body1">N/A</Typography>
              )}
            </Grid>
            <Grid item style={{ paddingBottom: 0, paddingTop: 0 }}>
              <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
                Owner
              </Typography>
              <CopyAddress address={owner} hasLink />
            </Grid>
          </Grid>
          <Grid item container direction="column" spacing={0}>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 'bolder' }}>
                Last Purchase Price
              </Typography>
            </Grid>
            {lastSale ? (
              <Grid item>
                <IconButton style={{ padding: 0, verticalAlign: 'baseline' }}>
                  <img
                    className={styles.networkIconMedium}
                    src="/collection/DOKOasset_EthereumBlue.png"
                    alt="eth"
                  />
                </IconButton>
                <Typography
                  variant="h5"
                  display="inline"
                  className="bolder"
                  style={{ marginRight: '4px' }}
                >
                  {lastSale.toFixed(3)}
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
            <Grid item style={{ marginTop: '.5em' }}>
              <Typography variant="h6" style={{ fontWeight: 'bolder' }}>
                Floor Price
              </Typography>
            </Grid>
            {floorPrice ? (
              <Grid item>
                <IconButton style={{ padding: 0, verticalAlign: 'baseline' }}>
                  <img
                    className={styles.networkIconMedium}
                    src="/collection/DOKOasset_EthereumBlue.png"
                    alt="eth"
                  />
                </IconButton>
                <Typography
                  variant="h5"
                  display="inline"
                  className="bolder"
                  style={{ marginRight: '4px' }}
                >
                  {parseFloat(`${floorPrice}`).toFixed(2)}
                </Typography>
              </Grid>
            ) : (
              <Grid item>
                <Typography variant="body1">N/A</Typography>
              </Grid>
            )}
            <Grid item style={{ marginTop: '.9em' }}>
              <Link style={{ textDecoration: 'none' }} target="_blank" href={externalLink}>
                <Button className={styles.profileButton}>
                  <img width={16} src={metaverseIcon[slug]} alt="" />
                  <span
                    style={{ marginLeft: 12, color: 'white' }}
                  >{`View on ${metaverseName}`}</span>
                </Button>
              </Link>
            </Grid>
          </Grid>
          <Hidden smUp>
            <Grid item container wrap="nowrap" justifyContent="flex-start" spacing={5}>
              <Grid item container xs={6} direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
                    MarketPlace
                  </Typography>
                  <Grid item style={{ marginTop: '.9em' }}>
                    <Link
                      style={{ textDecoration: 'none' }}
                      target="_blank"
                      href={`https://opensea.io/assets/${address}/${id}`}
                    >
                      <Button className="gradient-button" variant="outlined">
                        <img width={16} src={opensea_icon} alt="" />
                        <span style={{ marginLeft: 12 }}>Opensea</span>
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
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
                      href={`${window.origin}/collections/${address}`}
                    >
                      {collection}
                    </Link>
                  ) : (
                    <Typography variant="body1">{collection}</Typography>
                  )}
                </Grid>
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
          </Hidden>
          <Hidden xsDown>
            <Grid item container wrap="nowrap" justifyContent="flex-start" spacing={5}>
              <Grid item container xs={6} direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
                    MarketPlace
                  </Typography>
                  <Grid item style={{ marginTop: '.9em' }}>
                    <Link
                      style={{ textDecoration: 'none' }}
                      target="_blank"
                      href={`https://opensea.io/assets/${address}/${id}`}
                    >
                      <Button className="gradient-button" variant="outlined">
                        <img width={16} src={opensea_icon} alt="" />
                        <span style={{ marginLeft: 12 }}>Opensea</span>
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
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
                      href={`${window.origin}/collections/${address}`}
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
          </Hidden>
          <Grid item container direction="column">
            <Typography variant="h5" style={{ fontWeight: 'bolder', marginBottom: '0.6em' }}>
              Traits
            </Typography>
            {traits && traits.length ? (
              chain === 'solana' ? (
                <SolanaNftTraits traits={traits} />
              ) : (
                <NftTraits traits={traits} totalSupply={totalSupply} />
              )
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
    </>
  );
};

export default NftIndividual;
