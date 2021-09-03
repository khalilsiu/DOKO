import { Grid, makeStyles, Typography } from '@material-ui/core';

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

export const Footer = () => {
  const styles = useStyles();

  return (
    <Grid
      className={styles.footerContainer}
      container
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography variant="caption" style={{ color: 'black' }}>
        Ⓒ 2021 DOKO
      </Typography>
      <img height={24} src="/DOKO_LOGO_LOCKUP.png" alt="DOKO" />
      <Grid item>
        <Grid container spacing={3}>
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

const useStyles = makeStyles(() => ({
  footerContainer: {
    background: '#ffffff',
    padding: '24px 60px'
  }
}));
