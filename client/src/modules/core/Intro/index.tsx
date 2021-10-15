import { Button, Grid, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { DrawerContext } from '../../../contexts/DrawerContext';

const socialLinks = [
  {
    image: '/social/Twitter.png',
    link: 'https://twitter.com/doko_nft',
  },
  {
    image: '/social/Discord.png',
    link: 'https://discord.gg/cNvKMpbU5C',
  },
  {
    image: '/social/Medium.png',
    link: 'https://medium.com/doko-one',
  },
];

interface Props {
  drawer: boolean;
}

const Intro = ({ drawer = false }: Props) => {
  const { connect, loading, address } = useContext(AuthContext);
  const { toggle } = useContext(DrawerContext);
  // eslint-disable-next-line no-use-before-define
  const styles = useStyles();

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
                  <span style={{ marginLeft: 12, color: 'white' }}>Your Profile</span>
                </Button>
              </Link>
            ) : (
              <Button
                disabled={loading}
                variant="outlined"
                className={`gradient-button ${styles.aboutDokoButton}`}
                onClick={() => connect()}
              >
                Connect Wallets
              </Button>
            )}
          </Grid>
          <Grid item>
            <a
              style={{ textDecoration: 'none' }}
              href="https://doko-one.gitbook.io/doko/"
              target="_blank"
              rel="noreferrer"
            >
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
    padding: '8px 20px',
    width: 200,
    fontWeight: 'bold',
  },
  aboutDokoButton: {
    padding: '8px 20px',
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
