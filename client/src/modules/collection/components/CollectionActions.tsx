import { Grid, IconButton, makeStyles, Menu, MenuItem } from '@material-ui/core';
import { MouseEvent, SyntheticEvent, useState } from 'react';
import facebook from '../../../components/assets/facebook.png';
import twitter from '../../../components/assets/twitter.png';

interface Props {
  collection: any;

  onShare: (param: 'facebook' | 'twitter') => void;
}

const useStyles = makeStyles((theme) => ({
  shareItem: {
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white',
    },
    '& > img': {
      width: 24,
      marginRight: 12,
    },
  },
}));

export default function CollectionActions({ collection, onShare }: Props) {
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e: SyntheticEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Grid container justifyContent="flex-end" spacing={1}>
      <Grid item>
        <a
          href={`https://opensea.io/collection/${collection.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          <IconButton>
            <img width={36} src="/collection/DOKOasset_OpenSea.png" alt="" />
          </IconButton>
        </a>
      </Grid>
      <Grid item>
        <a
          href={`https://etherscan.io/address/${collection.contractAddress}`}
          target="_blank"
          rel="noreferrer"
        >
          <IconButton>
            <img width={36} src="/collection/DOKOasset_EtherScan.png" alt="" />
          </IconButton>
        </a>
      </Grid>
      <Grid item>
        <IconButton onClick={() => window.location.reload()}>
          <img width={36} src="/collection/DOKOasset_RefreshData.png" alt="" />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={handleClick}>
          <img width={36} src="/collection/DOKOasset_ShareWhiteCircle.png" alt="" />
        </IconButton>
        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem className={styles.shareItem} onClick={() => onShare('facebook')}>
            <img src={facebook} alt="facebook" />
            Share on Facebook
          </MenuItem>
          <MenuItem className={styles.shareItem} onClick={() => onShare('twitter')}>
            <img src={twitter} alt="twitter" />
            Share on Twitter
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
}
