import { CircularProgress, Grid, makeStyles, Typography } from '@material-ui/core';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import { OpenseaNFTItem } from './OpenseaNFTItem';
import { LightButton } from './LightButton';
import { Asset } from '../store/summary';

interface Props {
  nfts: (Asset & { floorPrice: number })[];
  total?: number;
  page?: number;
  onNext?: () => void;
  onPrev?: () => void;
  loading?: boolean;
  maxPage?: number;
  onLeaseButtonClick?: (asset: Asset | null) => void;
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

export const LandPagination = ({
  nfts,
  page,
  total,
  onNext = () => null,
  onPrev = () => null,
  loading = false,
  maxPage,
  onLeaseButtonClick,
}: Props) => {
  const styles = useStyles();

  return (
    <div>
      <div className={styles.nftsContainer}>
        {nfts.map((nft) => (
          <OpenseaNFTItem setSelectedAssetForLease={onLeaseButtonClick} nft={nft} key={nft.id} />
        ))}
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

export default LandPagination;
