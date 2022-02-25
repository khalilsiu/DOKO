import { Grid, Hidden, Card, makeStyles, Typography } from '@material-ui/core';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Meta, TabPanel } from '../../components';
import { CustomTabs, CustomTab } from '../../components/landProfile/OwnershipView';
import metaverses from '../../constants/metaverses';
import { getMetaverseAssetsFromServer } from '../../store/asset/metaverseAssetsFromServerSlice';
import { RootState } from '../../store/store';
import Intro from '../core/Intro';
import RentalView, { sortOptions } from './RentalView';

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

const RentalListingPage = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortStates, setSortStates] = useState(metaverses.map(() => 0));
  const metaverseAssets = useSelector((state: RootState) => state.metaverseAssets);
  const handleSortChange = (metaverseIndex: number, sortItemIndex: number) => {
    setSortOpen(false);
    const newSortStates = cloneDeep(sortStates);
    newSortStates[metaverseIndex] = sortItemIndex;
    setSortStates(newSortStates);
  };

  useEffect(() => {
    dispatch(
      getMetaverseAssetsFromServer(sortStates.map((sortItem) => sortOptions[sortItem].value)),
    );
  }, [sortStates]);
  return (
    <>
      <Meta
        title="Rentals | DOKO"
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
              Rental Listings
            </Typography>
            <Typography variant="subtitle1">
              This is where you can view your rental listings that are available on the metaverses.
            </Typography>
          </div>
          <CustomTabs
            style={{ marginTop: 12 }}
            indicatorColor="primary"
            textColor="primary"
            value={tabValue}
            onChange={(event, newValue) => setTabValue(newValue)}
          >
            <CustomTab
              key={metaverses[0].name}
              style={{ marginRight: '1rem' }}
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={metaverses[0].icon} alt="" width="15px" />
                  <Typography variant="body1" style={{ fontWeight: 'bold', marginLeft: '0.5rem' }}>
                    {metaverses[0].label}
                  </Typography>
                </div>
              }
              value={0}
            />
          </CustomTabs>
          {metaverses.map((metaverse, index) => (
            <TabPanel key={index} index={index} value={tabValue}>
              <RentalView
                metaverseIndex={index}
                handleSortChange={handleSortChange}
                sortOpen={sortOpen}
                setSortOpen={setSortOpen}
                sortIndex={sortStates[index]}
                assets={metaverseAssets[index]}
              />
            </TabPanel>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default RentalListingPage;
