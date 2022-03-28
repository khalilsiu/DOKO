import { Grid, makeStyles, Theme, Typography, useMediaQuery } from '@material-ui/core';
import LandPagination from 'components/LandPagination';
import RenderMaps from 'components/maps/RenderMaps';
import SectionLabel from 'components/SectionLabel';
import ListIcon from '@material-ui/icons/FormatListBulleted';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Asset } from 'store/profile/profileOwnershipSlice';
import LandCard from 'components/LandCard';
import { LeaseMode, ViewOption } from './OwnershipView';
import MapIcon from '@material-ui/icons/Map';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import ConfirmModal from 'components/ConfirmModal';
import { getAssetFromOpensea } from 'store/asset/assetSlice';
import { landlordTerminate } from 'store/lease/leasesSlice';
import { ContractContext } from 'contexts/ContractContext';
import { AuthContext } from 'contexts/AuthContext';

interface IAssetMapSection {
  metaverseName: string;
  assets: Asset[];
  metaverseIndex: number;
  onAssetClick: (collectionIndex: number, index: number) => void;
  view: ViewOption;
  onViewClick: (viewOption: ViewOption, metaverseIndex: number) => void;
  page: number;
  onPageChange: (page: number, metaverseIndex: number) => void;
  assetSelectedForMap: number | null;
  mode: LeaseMode;
}

interface IRenderAssets {
  assets: Asset[];
  metaverseIndex: number;
  mode: LeaseMode;
  onActionButtonClick: (headerText: string, bodyText: string, contractAddress: string, assetId: string) => void;
}

const AssetMapSection = ({
  metaverseName,
  assets,
  metaverseIndex,
  onAssetClick,
  view,
  onViewClick,
  page,
  onPageChange,
  assetSelectedForMap,
  mode,
}: IAssetMapSection) => {
  const smOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const { isLoading } = useSelector((state: RootState) => state.appState);
  const { address: walletAddress } = useContext(AuthContext);
  const styles = useStyles();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalTargetId, setConfirmModalTargetId] = useState('');
  const [confirmModalHeader, setConfirmModalHeader] = useState('');
  const [confirmModalBody, setConfirmModalBody] = useState('');
  const {
    contracts: { dclLandRental: dclLandRentalContract },
  } = useContext(ContractContext);
  const dispatch = useDispatch();
  const onActionButtonClick = (headerText: string, bodyText: string, contractAddress: string, assetId: string) => {
    dispatch(
      getAssetFromOpensea({
        contractAddress,
        tokenId: assetId,
      }),
    );
    setConfirmModalHeader(headerText);
    setConfirmModalBody(bodyText);
    setConfirmModalTargetId(assetId);
    setIsConfirmModalOpen(true);
  };

  const RenderAssets = memo(({ assets, metaverseIndex, mode, onActionButtonClick }: IRenderAssets) => {
    return (
      <>
        {assets.length ? (
          assets.map((asset, assetIndex) => (
            <Grid key={asset.id} item xs={6} style={{ maxHeight: 400 }}>
              <LandCard
                key={asset.id}
                asset={asset}
                onClick={() => onAssetClick(metaverseIndex, assetIndex)}
                onActionButtonClick={onActionButtonClick}
                mode={mode}
              />
            </Grid>
          ))
        ) : (
          <Typography style={{ marginLeft: 24 }}>No Items</Typography>
        )}
      </>
    );
  });

  const confirmModalAction = useCallback(async () => {
    await dispatch(
      landlordTerminate({
        assetId: confirmModalTargetId,
        dclLandRentalContract,
        operator: walletAddress,
      }),
    );
    setIsConfirmModalOpen(false);
  }, [dclLandRentalContract, confirmModalTargetId]);

  return (
    <div style={{ marginBottom: '3rem' }}>
      <Grid
        container
        direction={smOrAbove ? 'row' : 'column'}
        alignItems={smOrAbove ? 'center' : 'flex-start'}
        spacing={3}
        style={{ marginBottom: '0.5rem' }}
      >
        <Grid item>
          <SectionLabel variant="h5">{metaverseName}</SectionLabel>
        </Grid>
        {smOrAbove ? (
          <>
            <span
              className={styles.viewButton}
              onClick={() => onViewClick('list', metaverseIndex)}
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
              onClick={() => onViewClick('map', metaverseIndex)}
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
              onClick={() => onViewClick('list', metaverseIndex)}
              aria-hidden="true"
              className={styles.viewButtonIcon}
              style={view === 'list' ? { background: 'rgba(255, 255, 255, 0.25)' } : {}}
            >
              <ListIcon style={{ fill: '#FFFFFF', fontSize: '17px' }} />
            </span>
            <span
              onClick={() => onViewClick('map', metaverseIndex)}
              aria-hidden="true"
              className={styles.viewButtonIcon}
              style={view === 'map' ? { background: 'rgba(255, 255, 255, 0.25)' } : {}}
            >
              <MapIcon style={{ fill: '#FFFFFF', fontSize: '17px' }} />
            </span>
          </div>
        )}
      </Grid>

      <div key={`${metaverseName}listview`} style={view === 'list' ? {} : { display: 'none' }}>
        <LandPagination
          loading={isLoading}
          assets={assets.slice((page - 1) * 4, page * 4)}
          page={page}
          maxPage={Math.ceil(assets.length / 4)}
          onNext={() => onPageChange(page + 1, metaverseIndex)}
          onPrev={() => onPageChange(page - 1, metaverseIndex)}
          mode={mode}
          onActionButtonClick={onActionButtonClick}
        />
      </div>
      <div id={`${metaverseName}mapview`} style={view === 'map' ? {} : { display: 'none' }}>
        {smOrAbove ? (
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <Grid container spacing={1} style={{ height: 600, overflowY: 'scroll' }}>
                <RenderAssets
                  assets={assets}
                  metaverseIndex={metaverseIndex}
                  mode={mode}
                  onActionButtonClick={onActionButtonClick}
                />
              </Grid>
            </Grid>
            <Grid item xs={7} id="map">
              <RenderMaps assets={assets} metaverseName={metaverseName} assetSelected={assetSelectedForMap} />
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
                <RenderAssets
                  assets={assets}
                  metaverseIndex={metaverseIndex}
                  mode={mode}
                  onActionButtonClick={onActionButtonClick}
                />
              </Grid>
            </Grid>
            <Grid item id="map" style={{ height: 300, marginBottom: '4px' }}>
              <RenderMaps assets={assets} metaverseName={metaverseName} assetSelected={assetSelectedForMap} />
            </Grid>
          </Grid>
        )}
      </div>
      <ConfirmModal
        modalOpen={isConfirmModalOpen}
        closeModal={() => setIsConfirmModalOpen(false)}
        headerText={confirmModalHeader}
        bodyText={confirmModalBody}
        action={confirmModalAction}
      />
    </div>
  );
};

const useStyles = makeStyles(() => ({
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
}));

export default memo(AssetMapSection);
