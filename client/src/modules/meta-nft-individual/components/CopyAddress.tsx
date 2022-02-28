import { Grid, Tooltip, Typography, IconButton, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { minimizeAddress } from '../../../libs/utils';

interface CopyAddressProps {
  address: string;
  hasLink?: boolean;
}

export const CopyAddress = ({ address, hasLink = false }: CopyAddressProps) => {
  const [copied, setCopied] = React.useState(false);
  const classes = useStyles();

  const copy = React.useCallback(() => {
    if (copied) {
      return;
    }
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [copied, address]);

  return (
    <Grid container alignItems="center">
      {hasLink ? (
        <Typography variant="body1" className={classes.text}>
          <Link className={classes.link} href={`${window.origin}/address/${address}`}>
            {minimizeAddress(address)}
          </Link>
        </Typography>
      ) : (
        <Typography variant="body1" className={classes.text}>
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

const useStyles = makeStyles({
  text: {
    lineHeight: 2,
    fontSize: 21,
  },
  link: {
    color: '#43f3e5',
    textDecoration: 'none',
  },
});
