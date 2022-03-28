import { Grid, Typography, withStyles, makeStyles } from '@material-ui/core';
import ethBlueIcon from 'assets/tokens/eth-blue.png';
import SectionLabel from 'components/SectionLabel';
import { AggregatedSummary } from 'hooks/summary/aggregateSummaries';

const ChainContainer = withStyles((theme) => ({
  root: {
    padding: '28px 30px 24px',
    borderRadius: 15,
    border: '2px solid white',
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
}));

interface Props {
  summary: AggregatedSummary[];
}

export const Summary = ({ summary }: Props) => {
  const classes = useStyles();
  return (
    <>
      <SectionLabel variant="h5" gutterBottom>
        Summary
      </SectionLabel>
      <Grid style={{ marginTop: 32, marginBottom: 64 }} container spacing={2}>
        {summary.map((item) => (
          <Grid item key={item.name} xs={12} sm={6} lg={3}>
            <Grid container direction="column" style={{ height: '100%' }}>
              <Grid container alignItems="center">
                <img width={30} src={item.icon} alt={item.name} style={{ borderRadius: '50%' }} />
                <Typography style={{ marginLeft: 12, fontWeight: 700, fontSize: 14 }} component="strong">
                  {item.name}
                </Typography>
              </Grid>
              <ChainContainer container wrap="nowrap" style={{ flex: 1 }}>
                <Grid item>
                  <Typography style={{ fontSize: 14 }}>Total Parcels</Typography>
                  <Typography style={{ fontSize: 18, fontWeight: 700 }}>{item.count}</Typography>
                </Grid>
                <Grid item className={classes.chainInfo}>
                  <Typography style={{ fontSize: 14 }}>Total Floor Price</Typography>
                  <Typography
                    component="div"
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    <Grid container alignItems="center">
                      <img style={{ marginRight: 8 }} src={ethBlueIcon} width={10} alt="ETH" />
                      {parseFloat(`${item.totalFloorPrice}`).toFixed(3)}
                    </Grid>
                  </Typography>
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
