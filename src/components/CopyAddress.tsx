import { Grid, Tooltip, Typography, IconButton } from '@material-ui/core';
import { memo, useState } from 'react';
import { minimizeAddress } from 'utils/utils';
import CopyImage from 'assets/app/copy.png';

interface Props {
  address: string;
  minimize?: boolean;
}

export default memo(({ address, minimize = true }: Props) => {
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
      <span style={{ display: 'inline-block' }}>
        <Grid className="hover-button" container alignItems="center" onClick={copy}>
          <Typography variant="h6" style={{ lineHeight: 2 }}>
            {minimize ? minimizeAddress(address) : address}
          </Typography>
          <IconButton>
            <img height={13} src={CopyImage} />
          </IconButton>
        </Grid>
      </span>
    </Tooltip>
  );
});
