/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
import { memo, MouseEvent, SyntheticEvent, useState, useEffect, useRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import {
  Grid,
  IconButton,
  Button,
  makeStyles,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/MoreVert';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Address from './Address';

interface ProfileItemProps {
  profile: any;
  onClickEdit: any;
  onClickDelete: any;
}

const useStyles = makeStyles((theme) => ({
  card: {
    border: '2px solid rgba(255, 255, 255, 0.5)',
    boxSizing: 'border-box',
    borderRadius: '15px',
    aspectRatio: '1.08',
    [theme.breakpoints.down('sm')]: {
      aspectRatio: '1.28',
    },
  },
  options: {
    width: 140,
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white',
    },
  },
}));

export const ProfileItem = memo(({ profile, onClickEdit, onClickDelete }: ProfileItemProps) => {
  // eslint-disable-next-line no-use-before-define
  const styles = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const titleRef = useRef<any>(null);

  const [titleLength, setTitleLength] = useState(11);
  const [cookies, setCookie, removeCookie] = useCookies(['profiles']);

  useEffect(() => {
    function handleResize() {
      const width = titleRef.current.clientWidth;
      if (width < 270) {
        setTitleLength(7);
      } else if (width < 300) {
        setTitleLength(8);
      } else if (width < 360) {
        setTitleLength(11);
      } else if (width < 400) {
        setTitleLength(13);
      } else {
        setTitleLength(15);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const shortenName = (name: string) => {
    if (name.length > titleLength) {
      return `${name.substr(0, titleLength - 1)}...`;
    }
    return name;
  };

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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <Grid item xs={12} sm={6} lg={4} style={{ minWidth: '25vw' }}>
      <Grid className={styles.card}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ height: '20%', paddingLeft: 19 }}
          ref={titleRef}
        >
          <Typography variant="h5" style={{ fontWeight: 'bold', fontSize: '20px', lineHeight: '33px' }}>
            {`${shortenName(profile)} (${cookies.profiles[profile].address.length})`}
          </Typography>
          <div>
            <Button
              className="gradient-button"
              variant="outlined"
              style={{ fontSize: 12, lineHeight: '16px' }}
              onClick={() => { history.push(`/profiles/${cookies.profiles[profile].hash}`); }}
            >
              View
            </Button>
            <IconButton onClick={handleClick}>
              <MenuIcon style={{ fill: '#FFFFFF' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MenuItem className={styles.options} onClick={(e) => { navigator.clipboard.writeText(`https://doko.one/profiles/$${cookies.profiles[profile].hash}`); handleClose(e); }}>
                Copy Url
              </MenuItem>
              <MenuItem className={styles.options} onClick={(e) => { onClickEdit(); handleClose(e); }}>
                Edit
              </MenuItem>
              <MenuItem className={styles.options} onClick={(e) => { onClickDelete(); handleClose(e); }}>
                Delete
              </MenuItem>
            </Menu>
          </div>
        </Grid>
        <hr style={{ border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.5)', height: '1px', width: '100%', margin: 0 }} />

        {cookies.profiles[profile].address.length ? (
          <Grid
            container
            direction="column"
            alignItems="center"
            style={{ height: '80%' }}
            wrap="nowrap"
          >
            {cookies.profiles[profile].address.map((address: any) => (<Address address={address} />))}
          </Grid>)
          :
          (
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              style={{ height: '80%' }}
            >
              <Typography style={{ fontFamily: 'Open Sans', fontSize: '21px' }}>
                No addresses found
              </Typography>
            </Grid>
          )}

      </Grid>
    </Grid>
  );
});

export default ProfileItem;
