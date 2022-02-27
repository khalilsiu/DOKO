import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CopyAddress } from './CopyAddress';
import { Asset } from 'store/summary';

interface Props {
  asset: Asset;
}

export const TitleSection = React.memo<Props>(({ asset }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box>
        <Typography gutterBottom className={classes.title} variant="h4">
          {asset.name}
        </Typography>
        <Box className={classes.addresses}>
          {asset.creatorAddress && (
            <Box>
              <Box className={classes.addressType}>Creator</Box>
              <Box>
                <CopyAddress address={asset.creatorAddress} hasLink />
              </Box>
            </Box>
          )}
          {asset.ownerAddress && (
            <Box>
              <Box className={classes.addressType}>Owner</Box>
              <CopyAddress address={asset.ownerAddress} hasLink />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
});

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
  },
  addresses: {
    display: 'flex',
    color: 'white',
  },
  addressType: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '0.8rem',
  },
});
