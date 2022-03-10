import React from 'react';
import { Box, Hidden, IconButton, makeStyles, Typography } from '@material-ui/core';
import { CopyAddress } from './CopyAddress';
import PopoverShare from 'components/PopoverShare';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Asset } from 'store/summary/profileOwnershipSlice';

interface Props {
  asset: Asset;
}

export const TitleSection = React.memo<Props>(({ asset }) => {
  const classes = useStyles();
  const { address, id, chain } = useParams<{ address: string; id: string; chain: string }>();

  const onRefresh = React.useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <Box className={classes.root}>
      <Box>
        <Typography gutterBottom className={classes.title} variant="h4">
          {asset.name}
        </Typography>
        <Box className={classes.addresses}>
          <Box className={classes.addressBox}>
            <Box className={classes.addressType}>Creator</Box>
            <Box className={clsx({ [classes.naContainer]: !asset.creatorAddress })}>
              {asset.creatorAddress ? (
                <CopyAddress address={asset.creatorAddress} hasLink />
              ) : (
                <Typography className={classes.na} variant="body1">
                  N/A
                </Typography>
              )}
            </Box>
          </Box>
          <Box className={classes.addressBox}>
            <Box className={classes.addressType}>Owner</Box>
            <Box className={clsx({ [classes.naContainer]: !asset.ownerAddress })}>
              {asset.ownerAddress ? (
                <CopyAddress address={asset.ownerAddress} hasLink />
              ) : (
                <Typography className={classes.na} variant="body1">
                  N/A
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <Hidden xsDown>
          <IconButton onClick={onRefresh}>
            <img className={classes.refreshIcon} src="/collection/RefreshData.png" alt="back" />
          </IconButton>
        </Hidden>
        <PopoverShare onRefresh={onRefresh} address={address} tokenId={id} chain={chain} name={asset.name} />
      </Box>
    </Box>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    [theme.breakpoints.down('lg')]: {
      fontSize: '2em',
    },
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(2),
    },
  },
  addressBox: {
    paddingRight: theme.spacing(2),
    borderRight: '1px solid rgba(255,255,255,0.2)',
    [`&:last-child`]: {
      paddingLeft: theme.spacing(2),
      borderRight: 'none',
    },
  },
  addresses: {
    display: 'flex',
    color: 'white',
  },
  addressType: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '0.8rem',
  },
  refreshIcon: {
    width: 32,
    hight: 32,
  },
  naContainer: {
    paddingRight: theme.spacing(2),
  },
  na: {
    paddingTop: 8,
    fontSize: 21,
  },
}));
