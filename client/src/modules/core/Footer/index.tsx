import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import { memo } from 'react';

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

const FooterContainer = withStyles((theme) => ({
  root: {
    background: '#ffffff',
    padding: '24px 60px',
    [theme.breakpoints.down('sm')]: {
      padding: '12px 24px',
    },
  },
}))(Grid);

const useStyles = makeStyles((theme) => ({
  socialImageItem: {
    paddingLeft: theme.spacing(3),
    '& img': {
      width: 28,
      [theme.breakpoints.down('sm')]: {
        width: 20,
      },
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
    },
  },
}));

export const Footer = memo(() => {
  const styles = useStyles();

  return (
    <FooterContainer container justifyContent="space-between" alignItems="center">
      <Grid item xs={4}>
        <Typography variant="caption" style={{ color: 'black' }}>
          Ⓒ 2021 DOKO
        </Typography>
      </Grid>
      <img height={24} src="/DOKO_LOGO_LOCKUP.png" alt="DOKO" />
      <Grid item xs={4}>
        <Grid container alignItems="center" justifyContent="flex-end">
          {socialLinks.map((s) => (
            <Grid className={styles.socialImageItem} item key={s.image}>
              <a
                rel="noreferrer"
                href={s.link}
                target="_blank"
                style={{ display: 'block', lineHeight: 1 }}
              >
                <img src={s.image} alt="" />
              </a>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </FooterContainer>
  );
});

export default Footer;
