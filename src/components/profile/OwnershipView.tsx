import { Grid, Hidden, makeStyles, Tab, Tabs, withStyles, Button, CircularProgress, Box } from '@material-ui/core';
import { useState, useContext, memo, useEffect, useMemo, Fragment, useCallback } from 'react';
import EditLeaseModal from '../../modules/address-page/components/EditLeaseModal';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Summary from 'modules/address-page/components/Summary';
import { AggregatedSummary } from 'hooks/summary/aggregateSummaries';
import { RootState } from 'store/store';
import { TabPanel } from 'components/TabPanel';
import CreateProfileButtonImage from 'assets/app/profiles-page/create-profile-button.png';
import { AuthContext } from 'contexts/AuthContext';
import { CreateProfileContext } from 'contexts/CreateProfileContext';
import { useAssetSliceSelector, getAssetFromOpensea } from 'store/asset/assetSlice';
import { Asset } from 'store/profile/profileOwnershipSlice';
import BulletSection from './BulletSection';
import MetaverseMapSection from './MetaverseMapSection';
import LeaseDetailModal from 'components/rentals/LeaseDetailModal';
import { landlordTerminate, LeaseStatus } from 'store/lease/leasesSlice';
import ConfirmModal from 'components/ConfirmModal';
import { ContractContext } from 'contexts/ContractContext';
import { openToast } from 'store/app/appStateSlice';

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
  textColorPrimary: {
    color: 'white',
  },
})(Tab);

interface IOwnershipView {
  metaverseSummaries: AggregatedSummary[];
}

export const getLeaseState = (asset: Asset) => {
  if (!asset.lease) {
    return 'TOBECREATED';
  }

  if (asset.lease.status === LeaseStatus.LEASED && asset.lease.isRentOverdue) {
    return 'OVERDUE';
  }

  return asset.lease.status;
};

const tabs = [
  {
    label: 'Portfolio',
    value: 'portfolio',
  },
  {
    label: 'Rented',
    value: 'Rented',
  },
];

export type ViewOption = 'list' | 'map';
export type LeaseMode = 'lease' | 'rent';

const OwnershipView = ({ metaverseSummaries }: IOwnershipView) => {
  const { openProfileModal } = useContext(CreateProfileContext);
  const {
    contractAddress: urlContractAddress,
    tokenId: urlTokenId,
    mode,
  } = useParams<{ address: string; contractAddress: string; tokenId: string; mode: LeaseMode }>();
  const { checkAndSwitchNetwork, address: walletAddress } = useContext(AuthContext);
  const asset = useAssetSliceSelector((state) => state);
  const {
    contracts: { dclLandRental: dclLandRentalContract },
  } = useContext(ContractContext);
  const { isLoading } = useSelector((state: RootState) => state.appState);
  const [tabValue, setTabValue] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalTargetId, setConfirmModalTargetId] = useState('');
  const [confirmModalHeader, setConfirmModalHeader] = useState('');
  const [confirmModalBody, setConfirmModalBody] = useState('');

  const styles = useStyles();
  const dispatch = useDispatch();

  const rentedAssets = useMemo(() => {
    return metaverseSummaries.map((metaverse) => ({
      name: metaverse.name,
      assets: metaverse.rentedAssets,
    }));
  }, [metaverseSummaries]);

  const leasedAssets = useMemo(() => {
    return metaverseSummaries.map((metaverse) => ({
      name: metaverse.name,
      assets: metaverse.assets,
    }));
  }, [metaverseSummaries]);

  const handleClickOpen = () => {
    openProfileModal();
  };

  const confirmModalAction = useCallback(async () => {
    try {
      await checkAndSwitchNetwork();
    } catch (e: any) {
      dispatch(openToast({ message: (e as Error).message, state: 'error' }));
      return;
    }
    await dispatch(
      landlordTerminate({
        assetId: confirmModalTargetId,
        dclLandRentalContract,
        operator: walletAddress,
      }),
    );
    setIsConfirmModalOpen(false);
  }, [dclLandRentalContract, confirmModalTargetId]);

  const onActionButtonClick = (headerText: string, bodyText: string, contractAddress: string, assetId: string) => {
    dispatch(
      getAssetFromOpensea({
        contractAddress: contractAddress,
        tokenId: assetId,
      }),
    );
    setConfirmModalHeader(headerText);
    setConfirmModalBody(bodyText);
    setConfirmModalTargetId(assetId);
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

  const isShowModal = urlContractAddress && urlTokenId && walletAddress;

  return (
    <>
      <Grid item style={{ width: '100%' }}>
        <Hidden xsDown>
          <Button className={styles.createProfileButton} onClick={handleClickOpen}>
            <img src={CreateProfileButtonImage} alt="Create Profile" />
          </Button>
        </Hidden>
        <CustomTabs
          style={{ marginTop: 12 }}
          indicatorColor="primary"
          textColor="primary"
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
        >
          {tabs.map((tab, index) => (
            <CustomTab key={tab.value} style={{ fontWeight: 'bolder' }} label={tab.label} value={index} />
          ))}
        </CustomTabs>
      </Grid>
      <Grid item className={styles.contentSection}>
        {isLoading ? (
          <Box className={styles.circularProgressContainer}>
            <CircularProgress />
          </Box>
        ) : (
          <Fragment>
            <TabPanel index={0} value={tabValue}>
              <BulletSection metaverseSummaries={metaverseSummaries} />
              <Summary summary={metaverseSummaries} />
              <MetaverseMapSection
                metaverseMapSectionProps={leasedAssets}
                mode="lease"
                onActionButtonClick={onActionButtonClick}
              />
            </TabPanel>
            <TabPanel index={1} value={tabValue}>
              <MetaverseMapSection
                metaverseMapSectionProps={rentedAssets}
                mode="rent"
                onActionButtonClick={onActionButtonClick}
              />
            </TabPanel>
          </Fragment>
        )}
      </Grid>
      {isShowModal ? (
        <Fragment>
          {mode === 'lease' ? (
            <EditLeaseModal walletAddress={walletAddress} asset={asset} />
          ) : (
            <LeaseDetailModal walletAddress={walletAddress} asset={asset} mode="rent" />
          )}
        </Fragment>
      ) : isConfirmModalOpen ? (
        <ConfirmModal
          modalOpen={isConfirmModalOpen}
          closeModal={() => setIsConfirmModalOpen(false)}
          headerText={confirmModalHeader}
          bodyText={confirmModalBody}
          action={confirmModalAction}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(OwnershipView);

const useStyles = makeStyles(() => ({
  createProfileButton: {
    cursor: 'pointer',
    right: '4%',
    width: 162,
    height: 46,
    zIndex: 999,
    position: 'absolute',
  },
  circularProgressContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
    minHeight: 'calc(100vh - 168px)',
  },
}));
