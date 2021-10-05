import { CircularProgress, Grid, makeStyles } from '@material-ui/core';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';

import { OpenseaNFTItem } from './OpenseaNFTItem';
import { LightButton } from './LightButton';
import { NFTItem } from './NFTItem';

interface Props {
  nfts: any[];
  total?: number;
  page?: number;
  onNext?: () => void;
  onPrev?: () => void;
  isOpenSea?: boolean;
  loading?: boolean;
}

const useStyles = makeStyles((theme) => ({
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
}));

export const NftPagination = ({
  nfts,
  page,
  total,
  onNext = () => null,
  onPrev = () => null,
  isOpenSea = false,
  loading = false,
}: Props) => {
  const styles = useStyles();

  return (
    <div>
      <div className={styles.nftsContainer}>
        {!isOpenSea
          ? nfts.map((nft) => <NFTItem key={nft._id} nft={nft} />)
          : nfts.map((nft) => <OpenseaNFTItem nft={nft} key={nft.id} />)}
      </div>
      {loading && <CircularProgress />}
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
          <LightButton
            onClick={onNext}
            disabled={loading || !page || (total != null ? page >= total : nfts.length < 12)}
          >
            Next
            <ArrowRight color="secondary" />
          </LightButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default NftPagination;
