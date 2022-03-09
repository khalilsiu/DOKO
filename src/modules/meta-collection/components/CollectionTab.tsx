import { Divider, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import dateFormat from 'dateformat';
import { NftPagination } from '../../../components';

interface Props {
  collection: any;
  loading: boolean;
  nfts: any[];
  page: number;
  setPage: any;
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
  socialCollectionDetailContainer: {
    border: '1px solid white',
    borderRadius: 14,
  },
  socialCollectionDetailTier: {
    padding: '24px 36px',
  },
}));

export default function CollectionTab({ collection, loading, setPage, page, nfts }: Props) {
  const styles = useStyles();

  return (
    <div>
      {collection && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom style={{ fontWeight: 700 }}>
              Description
            </Typography>
            {collection.description && (
              <Typography style={{ color: 'white' }} dangerouslySetInnerHTML={{ __html: collection.description }} />
            )}
            <Grid container spacing={4} style={{ marginTop: 24 }}>
              <Grid item>
                <Typography variant="subtitle2">Total Items in Circulation</Typography>
                <Typography variant="h5" style={{ fontWeight: 700 }}>
                  {collection.stats.total_supply || 0}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2">Contract Deployment</Typography>
                <Typography variant="h5" style={{ fontWeight: 700 }}>
                  {dateFormat(collection.created_date, 'yyyy/mm/dd')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid className={styles.socialCollectionDetailContainer}>
              <Grid container className={styles.socialCollectionDetailTier} justifyContent="center">
                <Typography variant="h6">Social Media Data Coming Soon!</Typography>
                {/* <Grid item>
                <TweetField title="Followers" value={156} />
              </Grid>
              <Grid item>
                <TweetField title="Mentions(last 24h)" value={132} />
              </Grid>
              <Grid item>
                <TweetField title="Re-tweets" value={184} />
              </Grid> */}
              </Grid>
              <Divider style={{ backgroundColor: 'white' }} />
              <Grid container justifyContent="center" className={styles.socialCollectionDetailTier} spacing={2}>
                {collection.twitter_username && (
                  <Grid item>
                    <a href={`https://twitter.com/${collection.twitter_username}`} target="_blank" rel="noreferrer">
                      <IconButton>
                        <img src="/collection/DOKOasset_TwitterWhiteCircle.png" alt="src" width={24} />
                      </IconButton>
                    </a>
                  </Grid>
                )}
                {collection.discord_url && (
                  <Grid item>
                    <a href={collection.discord_url} target="_blank" rel="noreferrer">
                      <IconButton>
                        <img src="/collection/DOKOasset_DiscrodWhiteCircle.png" alt="src" width={24} />
                      </IconButton>
                    </a>
                  </Grid>
                )}
                {collection.external_url && (
                  <Grid item>
                    <a href={collection.external_url} target="_blank" rel="noreferrer">
                      <IconButton>
                        <img src="/collection/DOKOasset_NewWindow.png" alt="src" width={24} />
                      </IconButton>
                    </a>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Typography variant="h5" gutterBottom style={{ fontWeight: 700, marginTop: 64 }}>
        Collection
      </Typography>
      <NftPagination
        isOpenSea
        nfts={nfts}
        page={page}
        onNext={() => setPage(page + 1)}
        onPrev={() => setPage(page - 1)}
        loading={loading}
      />
    </div>
  );
}
