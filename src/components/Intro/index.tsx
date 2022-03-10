import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { AuthContext, AuthContextType } from 'contexts/AuthContext';
import { DrawerContext } from 'contexts/DrawerContext';
import twitterIcon from 'assets/socials/twitter-black-small.png';
import discordIcon from 'assets/socials/discord.png';
import mediumIcon from 'assets/socials/medium.png';

const socialLinks = [
  {
    image: twitterIcon,
    link: 'https://twitter.com/doko_metaverse',
  },
  {
    image: discordIcon,
    link: 'https://discord.gg/cNvKMpbU5C',
  },
  {
    image: mediumIcon,
    link: 'https://medium.com/doko-one',
  },
];

interface Props {
  drawer: boolean;
}

const Intro = ({ drawer = false }: Props) => {
  const { connect, address } = useContext(AuthContext) as AuthContextType;
  const { isLoading } = useSelector((state: RootState) => state.appState);

  const { toggle } = useContext(DrawerContext);

  const styles = useStyles();
  const history = useHistory();
  const { host } = window.location;
  let subdomain = '';
  const arr = host.split('.');
  if (arr.length > 0 && host.indexOf('staging') !== -1) {
    subdomain = arr[1];
  } else if (arr.length > 0) {
    subdomain = arr[0];
  }
  let link = 'https://doko-one.gitbook.io/doko/';
  if (subdomain !== 'nft') {
    link = 'https://doko-one.gitbook.io/doko-metaverse/';
  }

  return (
    <Grid
      className={styles.introContainer}
      container
      direction="column"
      alignItems="center"
      spacing={2}
      justifyContent={drawer ? 'space-between' : 'flex-start'}
      style={{ height: drawer ? '100%' : 'unset' }}
    >
      {drawer && (
        <IconButton className={styles.closeButton} onClick={toggle}>
          <CloseIcon />
        </IconButton>
      )}
      <Grid item className={styles.robotIcon} />

      <Grid item style={{ paddingLeft: 36, paddingRight: 36 }}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            {address ? (
              <Link style={{ textDecoration: 'none' }} to={`/address/${address}`}>
                <Button className={styles.profileButton}>
                  <img width={16} src="/CollectionsIcon.png" alt="" />
                  <span style={{ marginLeft: 12, color: 'white' }}>Your Address</span>
                </Button>
              </Link>
            ) : (
              <Button
                disabled={isLoading}
                variant="outlined"
                className={`gradient-button ${styles.aboutDokoButton}`}
                onClick={() => connect && connect()}
              >
                Connect Wallet
              </Button>
            )}
          </Grid>
          <Grid item>
            <Button className={styles.aboutDokoButton} onClick={() => history.push('/profiles')}>
              <img width={16} src="/manageProfile.png" alt="" />
              <span style={{ marginLeft: 12 }}>Manage Profile(s)</span>
            </Button>
          </Grid>
          <Grid item>
            <a style={{ textDecoration: 'none' }} href={link} target="_blank" rel="noreferrer">
              <Button className={styles.aboutDokoButton}>
                <img width={16} src="/DOKO_LOGO_BLACK.png" alt="" />
                <span style={{ marginLeft: 12 }}>About DOKO</span>
              </Button>
            </a>
          </Grid>
        </Grid>
      </Grid>

      <Grid item style={{ width: '100%' }}>
        <Grid className={styles.socialLinks} container spacing={3} justifyContent="center">
          {socialLinks.map((s) => (
            <Grid item key={s.image}>
              <a rel="noreferrer" href={s.link} target="_blank">
                <img width={28} src={s.image} alt="" />
              </a>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  introContainer: {
    padding: '36px 0 0',
    position: 'relative',
  },
  robotIcon: {
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid',
    borderColor: theme.palette.primary.main,
    width: 160,
    height: 160,
    background: 'url(/Robot.png)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    marginBottom: 24,
  },
  profileButton: {
    background: `linear-gradient(
      -45deg,
      #ff06d7 0%,
      #ff06d7 30%,
      rgba(80, 92, 176, 1) 50%,
      #00ffef 80%,
      #00ffef 100%
    )`,
    flex: 'row',
    justifyContent: 'flex-start',
    padding: '8px 20px',
    width: 200,
    fontWeight: 'bold',
  },
  aboutDokoButton: {
    flex: 'row',
    justifyContent: 'flex-start',
    padding: '4px 20px',
    width: 200,
    fontWeight: 'bold',
  },
  socialLinks: {
    marginTop: 80,
    padding: '16px 0',
    background: '#efefef',
    borderTop: '1px solid #ccc',
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
}));

export default Intro;
