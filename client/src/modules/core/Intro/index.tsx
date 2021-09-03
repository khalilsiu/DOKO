import { Button, Grid, makeStyles } from '@material-ui/core';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';

const socialLinks = [
  {
    image: '/social/Twitter.png',
    link: 'https://twitter.com/doko_nft'
  },
  {
    image: '/social/Discord.png',
    link: 'https://discord.gg/cNvKMpbU5C'
  },
  {
    image: '/social/Medium.png',
    link: 'https://medium.com/@doko_nft'
  }
];

export const Intro = () => {
  const { login, loading, address } = useContext(AuthContext);
  const styles = useStyles();

  return (
    <Grid
      className={styles.introContainer}
      container
      direction="column"
      alignItems="center"
      spacing={2}
    >
      <Grid item className={styles.robotIcon}></Grid>
      <Grid item style={{ paddingLeft: 36, paddingRight: 36 }}>
        {address ? (
          <Link style={{ textDecoration: 'none' }} to={`/collections/${address}`}>
            <Button className={styles.profileButton}>
              <img width={16} src="/CollectionsIcon.png" alt="" />
              <span style={{ marginLeft: 12, color: 'white' }}>Your Profile</span>
            </Button>
          </Link>
        ) : (
          <Button
            disabled={loading}
            variant="outlined"
            className={'gradient-button ' + styles.aboutDokoButton}
            onClick={() => login()}
          >
            Connect Metamask
          </Button>
        )}
      </Grid>
      <Grid item style={{ paddingLeft: 36, paddingRight: 36 }}>
        <a
          style={{ textDecoration: 'none' }}
          href="https://app.gitbook.com/@doko-nft/s/doko/"
          target="_blank"
          rel="noreferrer"
        >
          <Button className={styles.aboutDokoButton}>
            <img width={16} src="/DOKO_LOGO_BLACK.png" alt="" />
            <span style={{ marginLeft: 12 }}>About DOKO</span>
          </Button>
        </a>
      </Grid>

      <Grid item style={{ width: '100%' }}>
        <Grid className={styles.socialLinks} container spacing={3} justifyContent="center">
          {socialLinks.map(s => (
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

const useStyles = makeStyles(theme => ({
  introContainer: {
    padding: '36px 0 0'
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
    marginBottom: 24
  },
  profileButton: {
    background: `linear-gradient(
            -45deg,
            rgba(63, 199, 203, 1) 0%,
            rgba(63, 199, 203, 1) 30%,
            rgba(80, 92, 176, 1) 50%,
            rgba(148, 64, 161, 1) 80%,
            rgba(226, 69, 162, 1) 100%
    )`,
    padding: '8px 20px',
    width: 200
  },
  aboutDokoButton: {
    padding: '8px 20px',
    width: 200
  },
  socialLinks: {
    marginTop: 80,
    padding: '16px 0',
    background: '#efefef',
    borderTop: '1px solid #ccc'
  }
}));
