import { IconButton, makeStyles, Menu, MenuItem } from '@material-ui/core';
import { SyntheticEvent, useState, MouseEvent } from 'react';
import facebook from './assets/facebook.png';
import twitter from './assets/twitter.png';

const useStyles = makeStyles((theme) => ({
  shareIcon: {
    width: 20,
  },
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

const ShareButton = () => {
  const [shareActive, setShareActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const styles = useStyles();
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e: SyntheticEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const share = (event: MouseEvent<HTMLElement>, type: 'facebook' | 'twitter') => {
    event.stopPropagation();
    const url = '';
    const name = '';
    const link = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=Check out ${name} on DOKO now!`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=Check out ${name} on @doko_nft now!`,
      instagram: '',
    };
    window.open(link[type], '_blank');
  };
  return (
    <div>
      <IconButton
        onMouseEnter={() => setShareActive(true)}
        onMouseLeave={() => setShareActive(false)}
        onClick={handleClick}
        style={{ padding: 0 }}
      >
        {shareActive ? (
          <img className={styles.shareIcon} src="/icons/active-share.png" alt="share" />
        ) : (
          <img className={styles.shareIcon} src="/icons/inactive-share.png" alt="share" />
        )}
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem className={styles.shareItem} onClick={(e) => share(e, 'facebook')}>
          <img src={facebook} alt="facebook" />
          Share on Facebook
        </MenuItem>
        <MenuItem className={styles.shareItem} onClick={(e) => share(e, 'twitter')}>
          <img src={twitter} alt="twitter" />
          Share on Twitter
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ShareButton;
