import { useContext } from 'react';
import { Card, Grid, Hidden, IconButton, makeStyles, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import CopyAddress from 'components/CopyAddress';
import { CreateProfileContext } from 'contexts/CreateProfileContext';
import useAddressSummaries from 'hooks/summary/useAddressSummaries';
import OwnershipView from 'components/profile/OwnershipView';
import { minimizeAddress } from 'utils/utils';
import Intro from 'components/Intro';
import Meta from 'components/Meta';
import DOKOLogo from 'assets/doko/doko-logo.png';
import CreateProfileIcon from 'assets/app/profiles-page/create-profile-icon.png';

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
  itemsContainer: {
    paddingLeft: 36,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
    },
  },
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
  addressContainer: {
    marginBottom: 12,
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  addressText: {
    fontWeight: 'bolder',
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
    },
  },
}));

export const AddressPage = () => {
  const { address } = useParams<{ address: string }>();
  const styles = useStyles();
  const metaverseSummaries = useAddressSummaries(address);
  const { openProfileModal } = useContext(CreateProfileContext);
  const handleClickOpen = () => {
    openProfileModal();
  };

  return (
    <>
      <Meta
        title="Address | DOKO"
        description="The Multi-Chain NFT Portfolio Manager that allows you to display, manage & trade your NFTs"
        url="https://doko.one"
        image={DOKOLogo}
      />
      <Grid container wrap="nowrap" className={styles.collectionPageContainer}>
        <Hidden smDown>
          <Grid item>
            <Card className={styles.introCard}>
              <Intro drawer={false} />
            </Card>
          </Grid>
        </Hidden>
        <Grid className={styles.itemsContainer} container direction="column" alignItems="flex-start">
          <Hidden smUp>
            <Grid container direction="row" alignItems="center" justifyContent="flex-end" wrap="nowrap">
              <IconButton onClick={handleClickOpen}>
                <img src={CreateProfileIcon} alt="share" />
              </IconButton>
            </Grid>
          </Hidden>
          <Grid container justifyContent="space-between" alignItems="center" className={styles.addressContainer}>
            <Grid item xs={12} md="auto">
              <Grid container direction="column" className={styles.addressContainer}>
                <Typography className={styles.addressText} variant="h5" style={{ fontWeight: 'bolder' }}>
                  {minimizeAddress(address)}
                </Typography>
                <Grid item>
                  <CopyAddress address={address} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <OwnershipView metaverseSummaries={metaverseSummaries} />
        </Grid>
      </Grid>
    </>
  );
};

export default AddressPage;
