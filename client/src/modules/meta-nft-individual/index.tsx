import React from 'react';
import { Box, CircularProgress, Grid, Hidden, makeStyles } from '@material-ui/core';
import { ProfileCard } from './components/ProfileCard';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TitleSection } from './components/TitleSection';
import { MetaTag } from './components/MetaTag';
import { getAssetFromOpensea, useAssetSliceSelector } from 'store/asset/assetSlice';
import { AssetDescription } from './components/AssetDescription';
import { DetailTabs } from './components/DetailTabs';

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
        <Hidden mdDown>
          <Grid item className={classes.leftSection} md={12} lg={3} xl={2}>
            <ProfileCard />
          </Grid>
        </Hidden>
        <Grid item className={classes.rightSection} md={12} lg={9} xl={10}>
          {isFetching ? (
            <Box className={classes.circularProgressContainer}>
              <CircularProgress />
            </Box>
          ) : (
            <React.Fragment>
              <TitleSection asset={asset} />
              <AssetDescription asset={asset} />
              <DetailTabs />
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
    margin: '0 auto',
    flexWrap: 'nowrap',
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
    padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  rightSection: {
    flex: 1,
    width: '100%',
    padding: theme.spacing(4),
    minHeight: 'calc(100vh - 168px)',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
      minHeight: 'calc(100vh - 113px)',
    },
  },
}));

export default NftIndividual;
