import { CircularProgress, Grid, makeStyles, Typography } from '@material-ui/core';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import { SolanaNFTItem } from './SolanaNFTItem';
import { OpenseaNFTItem } from './OpenseaNFTItem';
import { LightButton } from './LightButton';
import { NFTItem } from './NFTItem';
import { Asset } from 'store/summary/profileOwnershipSlice';

interface Props {
  nfts: (Asset & { floorPrice: number })[];
  total?: number;
  page?: number;
  onNext?: () => void;
  onPrev?: () => void;
  isOpenSea?: boolean;
  isSolana?: boolean;
  loading?: boolean;
  maxPage?: number;
}

const useStyles = makeStyles((theme) => ({
  nftsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridAutoRows: '1fr',
    columnGap: 12,
    rowGap: 12,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    [theme.breakpoints.down(630)]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
}));

export const NftPagination = ({
  nfts,
  page,
  total,
  onNext = () => null,
  onPrev = () => null,
  isOpenSea = false,
  isSolana = false,
  loading = false,
  maxPage,
}: Props) => {
  const styles = useStyles();

  return (
    <div>
      <div className={styles.nftsContainer}>
        {isSolana
          ? nfts.map((nft) => <SolanaNFTItem key={nft.id} nft={nft} />)
          : !isOpenSea && nfts?.length
          ? nfts.map((nft) => <NFTItem key={nft.id} nft={nft} />)
          : nfts.map((nft) => <OpenseaNFTItem nft={nft} key={nft.id} />)}
      </div>
      {loading && <CircularProgress />}
      {!loading && (!page || page <= 1) && (!nfts || nfts.length === 0) ? (
        <Typography style={{ marginLeft: 24 }}>No Items</Typography>
      ) : (
        <Grid container justifyContent="space-between" style={{ marginTop: 20 }}>
          <Grid item>
            <LightButton onClick={onPrev} disabled={loading || !page || page <= 1}>
              <ArrowLeft color="secondary" />
              Previous
            </LightButton>
          </Grid>

          <Grid item style={{ color: 'white' }}>
            {total != null ? `${page} of ${total}` : page}
          </Grid>

          <Grid item>
            <LightButton onClick={onNext} disabled={loading || !page || page === maxPage}>
              Next
              <ArrowRight color="secondary" />
            </LightButton>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default NftPagination;
