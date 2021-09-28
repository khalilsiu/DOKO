import {useState} from 'react';
import Popover from './Popover';
import activeShare from '../assets/active-share.png';
import inactiveShare from '../assets/inactive-share-white.png';
import facebook from '../assets/facebook.png';
import twitter from '../assets/twitter.png';
import { useParams, useHistory } from 'react-router-dom';
import {
  
  IconButton,
  MenuList,
  MenuItem,
  makeStyles,
  withStyles
} from '@material-ui/core';

interface NFTItemProps {
  nft: any;
}

const CustomIconButton = withStyles({
  root: {
    padding: '1px'
  }
})(IconButton);

export const PopoverShare = () => {

  const styles = useStyles();
  const { address, id } = useParams<{ address: string, id: string }>();
  const [shareActive, setShareActive] = useState(false);

  const share = (type: 'facebook' | 'twitter') => {
    const url = `${window.origin}/nft/${address}/${id}`;
    const link = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=Check out my multi-chain NFT collection on DOKO at now!`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=Check out my multi-chain NFT collection on @doko_nft now!`,
      instagram: ''
    };
    window.open(link[type], '_blank');
  };

  return (
        <Popover style={{display: "inline-block"}}
            reference={
              <CustomIconButton
                onMouseEnter={() => setShareActive(true)}
                onMouseLeave={() => setShareActive(false)}
              >
                {shareActive ? (
                  <img className={styles.shareIcon} src={activeShare} alt="share" />
                ) : (
                  <img className={styles.shareIcon} src={inactiveShare} alt="share" />
                )}
              </CustomIconButton>
            }
            placement="bottom-end"
          >
            <MenuList>
              <MenuItem className={styles.shareItem} onClick={() => share('facebook')}>
                <img src={facebook} alt="facebook" />
                Share on Facebook
              </MenuItem>
              <MenuItem className={styles.shareItem} onClick={() => share('twitter')}>
                <img src={twitter} alt="twitter" />
                Share on Twitter
              </MenuItem>
            </MenuList>
          </Popover>
    )
}

const useStyles = makeStyles(theme => ({

  root: {
    display: 'inline-block'
  },
  shareIcon: {
    width: 30,
    height: 30
  },
  shareItem: {
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white'
    },
    '& > img': {
      width: 24,
      marginRight: 12
    }
  },
  notAvailableText: {
    color: '#b3b3b3',
    textAlign: 'center'
  }
}));

         