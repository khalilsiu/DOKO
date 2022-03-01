import { useState, memo, SyntheticEvent, MouseEvent } from 'react';
import { IconButton, MenuItem, makeStyles, withStyles, Menu } from '@material-ui/core';

import facebook from '../assets/facebook.png';
import twitter from '../assets/twitter.png';

const CustomIconButton = withStyles({
  root: {
    padding: '1px',
  },
})(IconButton);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
  },
  shareIcon: {
    width: 36,
    height: 36,
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
  notAvailableText: {
    color: '#b3b3b3',
    textAlign: 'center',
  },
}));

interface Props {
  name: string;
  chain: string;
  address: string;
  tokenId: string;
}

export const PopoverShare = memo(({ name, chain, address, tokenId }: Props) => {
  const styles = useStyles();

  const share = (e: MouseEvent<HTMLElement>, type: 'facebook' | 'twitter') => {
    e.stopPropagation();

    const url = `${window.origin}/nft/${chain}/${address}/${tokenId}`;
    const link = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=Check out ${name.replace(
        '#',
        '',
      )} on DOKO now!`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=Check out ${name.replace(
        '#',
        '',
      )} on @doko_nft now!`,
    };
    window.open(link[type], '_blank');
  };

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
    <>
      <CustomIconButton onClick={handleClick}>
        <img width={36} src="/collection/DOKOasset_ShareWhiteCircle.png" alt="" />
      </CustomIconButton>
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
    </>
  );
});

export default PopoverShare;
