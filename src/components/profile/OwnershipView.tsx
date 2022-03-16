import {
  Grid,
  Hidden,
  makeStyles,
  Tab,
  Tabs,
  Typography,
  withStyles,
  Button,
  useMediaQuery,
  Theme,
} from '@material-ui/core';
import { useState, useContext, memo, useEffect } from 'react';
import SectionLabel from '../SectionLabel';
import metaverses from '../../constants/metaverses';
import ListIcon from '@material-ui/icons/FormatListBulleted';
import MapIcon from '@material-ui/icons/Map';
import { CreateProfileContext } from '../../contexts/CreateProfileContext';
import RenderMaps from '../maps/RenderMaps';
import { Asset } from '../../store/summary/profileOwnershipSlice';
import LandPagination from '../LandPagination';
import { useMetaMask } from 'metamask-react';
import EditLeaseModal from './EditLeaseModal';
import { getAssetFromOpensea, useAssetSliceSelector } from '../../store/asset/assetSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Summary from 'modules/address-page/components/Summary';
import { AggregatedSummary } from 'hooks/summary/aggregateMetaverseSummaries';
import { RootState } from 'store/store';
import OpenseaNFTItem from 'components/LandCard';
import { TabPanel } from 'components/TabPanel';
import ethBlueIcon from 'assets/tokens/eth-blue.png';
import ConfirmModal from 'components/ConfirmModal';

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
    marginRight: '0.5rem',
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
  viewButtonMobile: {
    padding: '0.3rem',
    marginLeft: '12px',
    boxSizing: 'border-box',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '6px',
    width: '5rem',
    display: 'flex',
    height: '2rem',
    alignItems: 'center',
  },
  viewButtonIcon: {
    width: '1.3rem',
    height: '1.3rem',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px',
  },
  viewTypography: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '10px',
    lineHeight: '14px',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    padding: '1.5rem',
    [theme.breakpoints.down('sm')]: {
      padding: '0.5rem 1.3rem',
    },
    justifyContent: 'space-between',
  },
  modal: {
    width: '900px',
  },
  modalContent: {
    display: 'flex',
  },
}));

export const CustomTabs = withStyles({
  root: {
    width: '100%',
  },
  flexContainer: {
    borderBottom: '2px solid #46324a',
  },
})(Tabs);

export const CustomTab = withStyles({
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

interface IOwnershipView {
  metaverseSummaries: AggregatedSummary[];
}

export const isLeaseCompleted = (asset: Asset) => {
  if (!asset.lease) {
    return null;
  }
  const dateSigned = new Date(asset.lease.dateSigned);

  dateSigned.setMonth(dateSigned.getMonth() + asset.lease.finalLeaseLength);

  return Date.now() > dateSigned.getTime();
};

export const isRentOverDue = (asset: Asset) => {
  if (!asset.lease) {
    return null;
  }

  if (asset.lease.isOpen && !asset.lease.isLeased) {
    return false;
  }

  if (asset.lease.monthsPaid > asset.lease.finalLeaseLength) {
    return false;
  }

  const dateSigned = new Date(asset.lease.dateSigned);

  dateSigned.setMonth(dateSigned.getMonth() + asset.lease.monthsPaid);
  dateSigned.setDate(dateSigned.getDate() + asset.lease.gracePeriod);

  return Date.now() > dateSigned.getTime();
};

export const getLeaseState = (asset: Asset) => {
  if (!asset.lease) {
    return 'toBeCreated';
  }

  if (asset.lease && !asset.lease.isOpen && asset.lease.isLeased && isLeaseCompleted(asset)) {
    return 'completed';
  }

  if (asset.lease && asset.lease.isOpen && !asset.lease.isLeased) {
    return 'open';
  }

  if (asset.lease && !asset.lease.isOpen && asset.lease.isLeased && isRentOverDue(asset)) {
    return 'toBeTerminated';
  }

  if (asset.lease && !asset.lease.isOpen && asset.lease.isLeased && !isRentOverDue(asset)) {
    return 'toBeCanceled';
  }

  return 'unknown';
};

const OwnershipView = ({ metaverseSummaries }: IOwnershipView) => {
  const { openProfileModal } = useContext(CreateProfileContext);
  const { contractAddress: urlContractAddress, tokenId: urlTokenId } =
    useParams<{ address: string; contractAddress: string; tokenId: string }>();
  const { account: walletAddress } = useMetaMask();
  const asset = useAssetSliceSelector((state) => state);
  const { isLoading } = useSelector((state: RootState) => state.appState);
  const [tabValue, setTabValue] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalHeader, setConfirmModalHeader] = useState('');
  const [confirmModalBody, setConfirmModalBody] = useState('');
  const [confirmModalAction, setConfirmModalAction] = useState<any>(null);

  const styles = useStyles();
  const dispatch = useDispatch();
  const views = metaverses.map(() => useState('list'));
  const smOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const paginations = metaverses.map(() => useState(1));
  const [collectionAssetSelected, setCollectionAssetSelected] = useState<Array<number | null>>(
    metaverses.map(() => null),
  );

  const handleClickOpen = () => {
    openProfileModal();
  };

  const onAssetClick = (collectionIndex: number, index: number) => {
    const copy = collectionAssetSelected.slice();
    copy[collectionIndex] = index;
    setCollectionAssetSelected(copy);
  };

  const onActionButtonClick = (headerText: string, bodyText: string, action: () => void) => {
    setConfirmModalHeader(headerText);
    setConfirmModalBody(bodyText);
    setConfirmModalAction(action);
    setIsConfirmModalOpen(true);
  };

  useEffect(() => {
    if (urlContractAddress && urlTokenId) {
      dispatch(
        getAssetFromOpensea({
          contractAddress: urlContractAddress,
          tokenId: urlTokenId,
        }),
      );
    }
  }, [urlContractAddress, urlTokenId]);

  const [selectedAssetForLease, setSelectedAssetForLease] = useState<Asset | null>(null);
  interface IRenderAssets {
    assets: Asset[];
    metaverseIndex: number;
  }
  const RenderAssets = memo(({ assets, metaverseIndex }: IRenderAssets) => {
    return (
      <>
        {assets.length ? (
          assets.map((nft, nftIndex) => (
            <Grid key={nft.id} item xs={6} style={{ maxHeight: 400 }}>
              <OpenseaNFTItem
                key={nft.id}
                nft={nft}
                onClick={() => onAssetClick(metaverseIndex, nftIndex)}
                onActionButtonClick={onActionButtonClick}
                setSelectedAssetForLease={setSelectedAssetForLease}
                selectedAssetForLease={selectedAssetForLease}
              />
            </Grid>
          ))
        ) : (
          <Typography style={{ marginLeft: 24 }}>No Items</Typography>
        )}
      </>
    );
  });

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
                  {metaverseSummaries.reduce((count, collection) => count + collection.ownership.length, 0)}
                </Typography>
              </Grid>
              <Grid item className={styles.chainInfo}>
                <Typography style={{ fontSize: 14 }}>Total Floor Price</Typography>
                <Grid container alignItems="center">
                  <img style={{ marginRight: 8 }} src={ethBlueIcon} width={10} alt="ETH" />
                  <Typography style={{ fontSize: 18, fontWeight: 700 }}>
                    {metaverseSummaries.reduce((floorPrice, collection) => floorPrice + collection.price, 0).toFixed(3)}
                  </Typography>
                </Grid>
              </Grid>
            </ChainContainer>
          </Grid>
        </Grid>
        <Summary data={{ summary: metaverseSummaries }} />
        {metaverseSummaries.map((metaverse, metaverseIndex) => {
          const [page, setPage] = paginations[metaverseIndex];
          const [view, setView] = views[metaverseIndex];
          return (
            <div key={metaverse.name} style={{ marginBottom: '3rem' }}>
              <Grid
                container
                direction={smOrAbove ? 'row' : 'column'}
                alignItems={smOrAbove ? 'center' : 'flex-start'}
                spacing={3}
                style={{ marginBottom: '0.5rem' }}
              >
                <Grid item>
                  <SectionLabel variant="h5">{metaverse.name}</SectionLabel>
                </Grid>
                {smOrAbove ? (
                  <>
                    <span
                      className={styles.viewButton}
                      onClick={() => setView('list')}
                      aria-hidden="true"
                      style={view === 'list' ? { background: 'rgba(255, 255, 255, 0.25)' } : {}}
                    >
                      <ListIcon
                        style={{
                          fill: '#FFFFFF',
                          fontSize: '14px',
                          margin: '3px',
                        }}
                      />
                      <Typography className={styles.viewTypography}>List View</Typography>
                    </span>

                    <span
                      className={styles.viewButton}
                      onClick={() => setView('map')}
                      aria-hidden="true"
                      style={view === 'map' ? { background: 'rgba(255, 255, 255, 0.25)' } : {}}
                    >
                      <MapIcon
                        style={{
                          fill: '#FFFFFF',
                          fontSize: '14px',
                          margin: '3px',
                        }}
                      />
                      <Typography className={styles.viewTypography}>Map View</Typography>
                    </span>
                  </>
                ) : (
                  <div className={styles.viewButtonMobile}>
                    <span
                      onClick={() => setView('list')}
                      aria-hidden="true"
                      className={styles.viewButtonIcon}
                      style={view === 'list' ? { background: 'rgba(255, 255, 255, 0.25)' } : {}}
                    >
                      <ListIcon style={{ fill: '#FFFFFF', fontSize: '17px' }} />
                    </span>
                    <span
                      onClick={() => setView('map')}
                      aria-hidden="true"
                      className={styles.viewButtonIcon}
                      style={view === 'map' ? { background: 'rgba(255, 255, 255, 0.25)' } : {}}
                    >
                      <MapIcon style={{ fill: '#FFFFFF', fontSize: '17px' }} />
                    </span>
                  </div>
                )}
              </Grid>

              <div key={`${metaverse.name}listview`} style={view === 'list' ? {} : { display: 'none' }}>
                <LandPagination
                  onLeaseButtonClick={setSelectedAssetForLease}
                  onActionButtonClick={onActionButtonClick}
                  loading={isLoading}
                  nfts={metaverse.ownership.slice((page - 1) * 4, page * 4)}
                  page={page}
                  maxPage={Math.ceil(metaverse.ownership.length / 4)}
                  onNext={() => setPage(page + 1)}
                  onPrev={() => setPage(page - 1)}
                />
              </div>
              <div id={`${metaverse.name}mapview`} style={view === 'map' ? {} : { display: 'none' }}>
                {smOrAbove ? (
                  <Grid container spacing={1}>
                    <Grid item xs={5}>
                      <Grid container spacing={1} style={{ height: 600, overflowY: 'scroll' }}>
                        <RenderAssets assets={metaverse.ownership} metaverseIndex={metaverseIndex} />
                      </Grid>
                    </Grid>
                    <Grid item xs={7} id="map">
                      <RenderMaps
                        assets={metaverse.ownership}
                        metaverseName={metaverse.name}
                        assetsSelected={collectionAssetSelected}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid direction="column-reverse" container spacing={1}>
                    <Grid item>
                      <Grid
                        direction="column"
                        container
                        style={{
                          height: 300,
                          overflowX: 'scroll',
                          width: '100%',
                        }}
                      >
                        <RenderAssets assets={metaverse.ownership} metaverseIndex={metaverseIndex} />
                      </Grid>
                    </Grid>
                    <Grid item id="map" style={{ height: 300, marginBottom: '4px' }}>
                      <RenderMaps
                        assets={metaverse.ownership}
                        metaverseName={metaverse.name}
                        assetsSelected={collectionAssetSelected}
                      />
                    </Grid>
                  </Grid>
                )}
              </div>
            </div>
          );
        })}
      </TabPanel>
      {urlContractAddress && urlTokenId && walletAddress && (
        <EditLeaseModal walletAddress={walletAddress} asset={asset} />
      )}
      <ConfirmModal
        modalOpen={isConfirmModalOpen}
        closeModal={() => setIsConfirmModalOpen(false)}
        headerText={confirmModalHeader}
        bodyText={confirmModalBody}
        action={confirmModalAction}
      />
    </>
  );
};

export default memo(OwnershipView);
