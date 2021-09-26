import { Button, makeStyles, Tooltip } from '@material-ui/core';
import { useState } from 'react';
import { minimizeAddress } from '../../../libs/utils';

interface Props {
  onLogin: () => void;
  address: string | null;
  loading: boolean;
}

export const HeaderUserButton = ({ onLogin = () => null, address, loading }: Props) => {
  const styles = useStyles();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (copied) {
      return;
    }
    navigator.clipboard.writeText(address as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return address ? (
    <Tooltip title={copied ? 'Copied' : 'Copy'}>
      <Button className={styles.loggedInBtn} variant="outlined" disabled={loading} onClick={copy}>
        {minimizeAddress(address)}
        <img height={13} src="/copy.png" alt="" />
      </Button>
    </Tooltip>
  ) : (
    <Button
      style={{ marginLeft: 24, width: 240 }}
      className="gradient-button"
      disabled={loading}
      variant="outlined"
      onClick={() => onLogin()}
    >
      Connect Phantom
    </Button>
  );
};

const useStyles = makeStyles(() => ({
  loggedInBtn: {
    borderRadius: 8,
    color: 'white',
    borderColor: 'white !important',
    '& img': {
      marginLeft: 8
    }
  }
}));
