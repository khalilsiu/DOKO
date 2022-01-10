import {
  Grid,
  Hidden,
  makeStyles,
  Tab,
  Tabs,
  Typography,
  withStyles,
  Button,
} from '@material-ui/core';
import { useState, useContext } from 'react';
import { TabPanel, NftPagination, OpenseaNFTItem } from '.';
import Summary from '../modules/nft-collections/Summary';
import SectionLabel from './SectionLabel';
import metaverses from '../constants/metaverses';
import { AggregatedSummary } from '../hooks/useProfileSummaries';
import ListIcon from '@material-ui/icons/FormatListBulleted';
import MapIcon from '@material-ui/icons/Map';
import { CreateProfileContext } from '../contexts/CreateProfileContext';

const useStyles = makeStyles((theme) => ({
  createProfileButton: {
    cursor: 'pointer',
    right: '4%',
    width: 162,
    height: 46,
    zIndex: 999,
    position: 'absolute',
  },
  totalSummary: {
    width: '345px',
    height: '99px',
    left: '467px',
    top: '502px',
    background: 'rgba(255,255,255,0.25)',
    borderRadius: '15px',
    marginBottom: '24px',
  },
  summaryLeftDiv: {
    width: '40px',
    height: '99px',
    left: '507px',
    top: '601px',
    background: '#FF06D7',
    borderRadius: '0px 15px 15px 0px',
    transform: 'rotate(-180deg)',
  },
  chainInfo: {
    marginLeft: 48,
  },
  viewButton: {
    cursor: 'pointer',
    width: '81.73px',
    height: '24px',
    left: '705px',
    top: '1560px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxSizing: 'border-box',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTypography: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '10px',
    lineHeight: '14px',
  },
  map: {
    height: 600,
    width: '100%',
    border: '3px solid rgba(255, 255, 255, 0.5)',
    boxSizing: 'border-box',
    borderRadius: '15px',
  },
}));

const CustomTabs = withStyles({
  root: {
    width: '100%',
  },
  flexContainer: {
    borderBottom: '2px solid #46324a',
  },
})(Tabs);

const CustomTab = withStyles({
  wrapper: {
    textTransform: 'none',
  },
})(Tab);

const ChainContainer = withStyles(() => ({
  root: {
    padding: '10px 30px 24px',
    marginTop: 10,
  },
}))(Grid);

interface IOwnershipViewProps {
  metaverseSummaries: AggregatedSummary[];
}

const OwnershipView = ({ metaverseSummaries }: IOwnershipViewProps) => {
  const { openProfileModal } = useContext(CreateProfileContext);
  const [tabValue, setTabValue] = useState(0);
  const styles = useStyles();
  const views = metaverses.map(() => useState('list'));
  const paginations = metaverses.map(() => useState(1));
  const handleClickOpen = () => {
    openProfileModal();
  };

  // const handleMapViewClick = (nft, index) => () => {
  //   const address_url = nft.imageOriginalUrl;
  //   const x_start = address_url.indexOf('x=') + 2;
  //   const x_end = address_url.indexOf('&');
  //   const y_start = address_url.indexOf('y=') + 2;
  //   if (
  //     Number.isNaN(parseFloat(address_url.slice(y_start))) ||
  //     Number.isNaN(parseFloat(address_url.slice(x_start, x_end)))
  //   )
  //     return;
  //   const coordinate: Pair<number, number> = [
  //     parseFloat(address_url.slice(y_start)),
  //     parseFloat(address_url.slice(x_start, x_end)),
  //   ];
  //   maps[index].setView(coordinate, 9);
  //   const popupWindow = L.popup();
  //   popupWindow.setLatLng(coordinate).setContent(renderPopUp(nft)).openOn(maps[index]);
  // };
  return (
    <>
      <Grid item style={{ width: '100%' }}>
        <Hidden xsDown>
          <Button className={styles.createProfileButton} onClick={handleClickOpen}>
            <img src="/createProfileButton.png" alt="Create Profile" />
          </Button>
        </Hidden>
        <CustomTabs
          style={{ marginTop: 12 }}
          indicatorColor="primary"
          textColor="primary"
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
        >
          <CustomTab style={{ fontWeight: 'bolder' }} label="Portfolio" value={0} />
        </CustomTabs>
      </Grid>
      <TabPanel index={0} value={tabValue}>
        <Grid className={styles.totalSummary} container direction="row">
          <Grid className={styles.summaryLeftDiv} />
          <Grid>
            <ChainContainer container wrap="nowrap" style={{ flex: 1 }}>
              <Grid item>
                <Typography style={{ fontSize: 14 }}>Total Parcels</Typography>
                <Typography style={{ fontSize: 18, fontWeight: 700 }}>
                  {metaverseSummaries.reduce(
                    (count, collection) => count + collection.ownership.length,
                    0,
                  )}
                </Typography>
              </Grid>
              <Grid item className={styles.chainInfo}>
                <Typography style={{ fontSize: 14 }}>Total Floor Price</Typography>
                <Grid container alignItems="center">
                  <img
                    style={{ marginRight: 8 }}
                    src="/collection/DOKOasset_EthereumBlue.png"
                    width={10}
                    alt="ETH"
                  />
                  <Typography style={{ fontSize: 18, fontWeight: 700 }}>
                    {metaverseSummaries
                      .reduce((floorPrice, collection) => floorPrice + collection.price, 0)
                      .toFixed(3)}
                  </Typography>
                </Grid>
              </Grid>
            </ChainContainer>
          </Grid>
        </Grid>
        <Summary data={{ summary: metaverseSummaries }} />
        {metaverseSummaries.map((metaverse, index) => {
          const [page, setPage] = paginations[index];
          const [view, setView] = views[index];
          return (
            <div key={metaverse.name}>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
                style={{ marginTop: 48, marginBottom: 24 }}
              >
                <Grid item>
                  <SectionLabel variant="h5" style={{ marginTop: 48, marginBottom: 24 }}>
                    {metaverse.name}
                  </SectionLabel>
                </Grid>
                {/* <Grid item style={{ marginTop: 48, marginBottom: 24 }}>
                  <span
                    className={styles.viewButton}
                    onClick={() => setView('list')}
                    aria-hidden="true"
                    style={view === 'list' ? { background: 'rgba(255, 255, 255, 0.25)' } : {}}
                  >
                    <ListIcon style={{ fill: '#FFFFFF', fontSize: '14px', margin: '3px' }} />
                    <Typography className={styles.viewTypography}>List View</Typography>
                  </span>
                </Grid>
                <Grid item style={{ marginTop: 48, marginBottom: 24 }}>
                  <span
                    className={styles.viewButton}
                    onClick={() => setView('map')}
                    aria-hidden="true"
                    style={view === 'map' ? { background: 'rgba(255, 255, 255, 0.25)' } : {}}
                  >
                    <MapIcon style={{ fill: '#FFFFFF', fontSize: '14px', margin: '3px' }} />
                    <Typography className={styles.viewTypography}>Map View</Typography>
                  </span>
                </Grid> */}
              </Grid>
              <div
                key={`${metaverse.name}listview`}
                style={view === 'list' ? {} : { display: 'none' }}
              >
                <NftPagination
                  loading={metaverse.loading}
                  isOpenSea
                  nfts={metaverse.ownership.slice((page - 1) * 5, page * 5)}
                  page={page}
                  maxPage={Math.ceil(metaverse.ownership.length / 5)}
                  onNext={() => setPage(page + 1)}
                  onPrev={() => setPage(page - 1)}
                />
              </div>
              <div
                id={`${metaverse.name}mapview`}
                style={view === 'map' ? {} : { display: 'none' }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={5}>
                    <Grid container spacing={1} style={{ height: 600, overflowY: 'scroll' }}>
                      {metaverse.ownership.length ? (
                        metaverse.ownership.map((nft) => (
                          <Grid key={nft.id} item xs={6} style={{ maxHeight: 400 }}>
                            <OpenseaNFTItem key={nft.id} nft={nft} />
                          </Grid>
                        ))
                      ) : (
                        <Typography style={{ marginLeft: 24 }}>No Items</Typography>
                      )}
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={7}>
                    <div id={`${metaverse.name}_map`} className={styles.map} />
                  </Grid> */}
                </Grid>
              </div>
            </div>
          );
        })}
      </TabPanel>
    </>
  );
};

export default OwnershipView;
