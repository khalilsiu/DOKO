import React from 'react';
import { Box, CircularProgress, Grid, Hidden, makeStyles } from '@material-ui/core';
import { ProfileCard } from './components/ProfileCard';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TitleSection } from './components/TitleSection';
import { MetaTag } from './components/MetaTag';
import { getAssetFromOpensea, useAssetSliceSelector } from 'store/asset/assetSlice';
import { AssetDescription } from './components/AssetDescription';

const NftIndividual = React.memo(() => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { address, id } = useParams<{ address: string; id: string; chain: string }>();
  const asset = useAssetSliceSelector((state) => state.asset);
  const isFetching = useAssetSliceSelector((state) => state.fetching);
  console.log('asset', asset);

  React.useEffect(() => {
    dispatch(getAssetFromOpensea({ contractAddress: address, assetId: id }));
  }, []);

  return (
    <React.Fragment>
      <MetaTag asset={asset} />
      <Grid className={classes.root} container>
        <Hidden smDown>
          <Grid item className={classes.leftSection}>
            <ProfileCard />
          </Grid>
        </Hidden>
        <Grid item className={classes.rightSection}>
          {isFetching ? (
            <Box className={classes.circularProgressContainer}>
              <CircularProgress />
            </Box>
          ) : (
            <React.Fragment>
              <TitleSection asset={asset} />
              <AssetDescription asset={asset} />
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 1900,
    margin: '0 auto',
  },
  circularProgressContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftSection: {
    display: 'flex',
    width: 420,
    padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  rightSection: {
    flex: 1,
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      height: 'calc(100vh - 113px)',
    },
    [theme.breakpoints.up('md')]: {
      height: 'calc(100vh - 168px)',
    },
  },
}));

export default NftIndividual;
