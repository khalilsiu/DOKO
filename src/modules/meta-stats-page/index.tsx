import { Grid, Hidden, Card, makeStyles, Typography } from '@material-ui/core';
import Intro from 'components/Intro';
import Meta from 'components/Meta';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDclStats } from '../../store/stats/dclStatsSlice';
import { RootState } from '../../store/store';
import StatsView from './StatsView';

const useStyles = makeStyles((theme) => ({
  collectionPageContainer: {
    padding: 24,
    marginTop: 36,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginTop: 0,
    },
    minHeight: 'calc(100vh)',
  },
  introCard: {
    position: 'sticky',
    top: 120,
  },
}));

const MetaStatsPage = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const dclStats = useSelector((state: RootState) => state.dclStats);
  const { isLoading } = useSelector((state: RootState) => state.appState);
  useEffect(() => {
    dispatch(getDclStats());
  }, []);
  return (
    <>
      <Meta
        title="Stats | DOKO"
        description="The Multi-Chain NFT Portfolio Manager that allows you to display, manage & trade your NFTs"
        url="https://doko.one"
        image="/DOKO_LOGO.png"
      />
      <Grid container wrap="nowrap" className={styles.collectionPageContainer}>
        <Hidden smDown>
          <Grid item style={{ marginRight: '4rem' }}>
            <Card className={styles.introCard}>
              <Intro drawer={false} />
            </Card>
          </Grid>
        </Hidden>

        <Grid item md>
          <div style={{ marginBottom: '2rem' }}>
            <Typography variant="h3" style={{ fontWeight: 'bolder' }}>
              Decentraland Traffic Statistics
            </Typography>
            <Typography variant="subtitle1">
              You can find traffic data of individual Decentraland parcels below for yesterday, last 7 days and last 30
              days. You may sort any of the columns or search for a coordinate with the search bar. If you are
              interested in contributing to help us build tools with this data, feel free to DM us on Twitter or
              Discord. Hope it helps!
            </Typography>
          </div>
          <StatsView stats={dclStats} isLoading={isLoading} />
        </Grid>
      </Grid>
    </>
  );
};

export default MetaStatsPage;
