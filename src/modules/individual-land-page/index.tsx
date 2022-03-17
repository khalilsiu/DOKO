import React from 'react';
import { Box, CircularProgress, Grid, Hidden, makeStyles } from '@material-ui/core';
import { ProfileCard } from './components/ProfileCard';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MetaTag } from './components/MetaTag';
import { getAssetFromOpensea, useAssetSliceSelector } from 'store/asset/assetSlice';
import { AssetDescription } from './components/AssetDescription';
import { DetailTabs } from './components/DetailTabs';
import { RootState } from 'store/store';
import { TitleSection } from './components/TitleSection';

const IndividualLandPage = React.memo(() => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { address, id } = useParams<{ address: string; id: string; chain: string }>();
  const asset = useAssetSliceSelector((state) => state);
  const isFetching = useSelector((state: RootState) => state.appState.isLoading);

  React.useEffect(() => {
    dispatch(getAssetFromOpensea({ contractAddress: address, tokenId: id }));
  }, []);

  return (
    <React.Fragment>
      <MetaTag asset={asset} />
      <Grid className={classes.root} container>
        <Hidden mdDown>
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
    width: '300px',
  },
  rightSection: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
    padding: theme.spacing(4),
    minHeight: 'calc(100vh - 168px)',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
      minHeight: 'calc(100vh - 113px)',
    },
  },
}));

export default IndividualLandPage;
