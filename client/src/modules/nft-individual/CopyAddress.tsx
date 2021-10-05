import { Grid, Tooltip, Typography, IconButton } from '@material-ui/core';
import { useState } from 'react';
import { minimizeAddress } from '../../libs/utils';

interface CopyAddressProps {
  address: string;
}

// eslint-disable-next-line import/prefer-default-export
export const CopyAddress = ({ address }: CopyAddressProps) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (copied) {
      return;
    }
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Tooltip title={copied ? 'Copied' : 'Copy'} placement="right">
      <Grid className="hover-button" container alignItems="center" onClick={() => copy()}>
        <Typography variant="body1" style={{ lineHeight: 2 }}>
          {minimizeAddress(address)}
        </Typography>
        <IconButton>
          <img height={13} src="/copy.png" alt="" />
        </IconButton>
      </Grid>
    </Tooltip>
  );
};
