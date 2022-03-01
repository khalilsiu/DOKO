import { Grid, Tooltip, Typography, IconButton, Link } from '@material-ui/core';
import { useState } from 'react';
import { minimizeAddress } from '../../libs/utils';

interface CopyAddressProps {
  address: string;
  hasLink?: boolean;
}

export const CopyAddress = ({ address, hasLink = false }: CopyAddressProps) => {
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
    <Grid container alignItems="center">
      {hasLink ? (
        <Typography variant="body1" style={{ lineHeight: 2 }}>
          <Link
            style={{ textDecoration: 'none', color: '#61dafb' }}
            href={`${window.origin}/address/${address}`}
          >
            {minimizeAddress(address)}
          </Link>
        </Typography>
      ) : (
        <Typography variant="body1" style={{ lineHeight: 2 }}>
          {minimizeAddress(address)}
        </Typography>
      )}
      <Tooltip title={copied ? 'Copied' : 'Copy'} placement="right">
        <IconButton className="hover-button" onClick={() => copy()}>
          <img height={13} src="/copy.png" alt="" />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};
