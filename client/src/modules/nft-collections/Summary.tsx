import {
  Grid,
  Typography,
  withStyles,
  makeStyles,
  CircularProgress,
  useMediaQuery,
  Theme,
} from '@material-ui/core';
import SectionLabel from '../../components/SectionLabel';

const ChainContainer = withStyles((theme) => ({
  root: {
    padding: '28px 30px 24px',
    borderRadius: 15,
    border: '2px solid rgba(277,277,277,0.5)',
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}))(Grid);

const useStyles = makeStyles((theme) => ({
  chainInfo: {
    marginLeft: 48,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: 12,
    },
  },
  summaryBox: { flex: 1 },
}));

interface Props {
  data: any;
}

export const Summary = ({ data }: Props) => {
  const classes = useStyles();
  const smOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

  return (
    <>
      {smOrAbove && (
        <SectionLabel variant="h5" gutterBottom>
          Summary
        </SectionLabel>
      )}
      <Grid style={{ marginTop: 32, marginBottom: 64 }} container spacing={1}>
        {data.summary.map((item: any) => (
          <Grid item key={item.name} xs={6} sm={6} lg={3}>
            <Grid container direction="column" style={{ height: '100%' }}>
              {smOrAbove && (
                <Grid container alignItems="center">
                  <img width={30} src={item.icon} alt={item.name} style={{ borderRadius: '50%' }} />
                  <Typography
                    style={{ marginLeft: 12, fontWeight: 700, fontSize: 14 }}
                    component="strong"
                  >
                    {item.name}
                  </Typography>
                </Grid>
              )}
              <ChainContainer
                container
                wrap="nowrap"
                style={smOrAbove ? {} : { padding: '0.8rem' }}
                className={classes.summaryBox}
              >
                <Grid item>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography style={{ fontSize: '0.8rem' }}>Total NFTs</Typography>
                    {!smOrAbove && (
                      <img
                        width={20}
                        src={item.icon}
                        alt={item.name}
                        style={{ borderRadius: '50%' }}
                      />
                    )}
                  </div>
                  <Typography style={{ fontSize: '1rem', fontWeight: 700 }}>
                    {item.count}
                  </Typography>
                </Grid>
                <Grid item className={classes.chainInfo}>
                  <Typography style={{ fontSize: '0.8rem' }}>Total Floor Price</Typography>
                  <Typography
                    component="div"
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      opacity: item.available ? 1 : 0.5,
                    }}
                  >
                    {item.available ? (
                      <Grid container alignItems="center">
                        <img
                          style={{ marginRight: 8 }}
                          src="/collection/DOKOasset_EthereumBlue.png"
                          width={10}
                          alt="ETH"
                        />
                        {parseFloat(`${item.price}`).toFixed(3)}
                      </Grid>
                    ) : (
                      'Coming Soon'
                    )}
                  </Typography>
                  {item.loading && <CircularProgress />}
                </Grid>
              </ChainContainer>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Summary;
