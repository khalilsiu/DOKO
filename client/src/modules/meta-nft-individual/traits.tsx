import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Card, Grid, makeStyles, Typography } from '@material-ui/core';

interface NFtTraitsProps {
  traits: any;
}

const useStyles = makeStyles((theme) => ({
  traitFooter: {
    marginTop: '1.2em',
    textAlign: 'center',
  },
  traitCard: {
    padding: '1em',
    background: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxHeight: '125px',
    width: '100%',
    borderRadius: '20px',
    border: '1px solid white',
    borderOpacity: '0.5',
    alignItems: 'center',
    color: 'inherit',
  },
  traitType: {
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '19px',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    opacity: '0.5',
    [theme.breakpoints.down('sm')]: {
      lineHeight: '11px',
      fontSize: '8px',
    },
  },
  value: {
    fontWeight: 'bolder',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
  },
}));

export const GradientSVG = () => {
  const color0 = '#ff06d7';
  const color30 = '#ff06d7';
  const color50 = '#505cb0';
  const color80 = '#00ffef';
  const color100 = '#00ffef';
  const gradientTransform = 'rotate(-45)';
  const idCSS = 'lingrad';

  return (
    <svg style={{ height: 0, width: 0 }}>
      <defs>
        <linearGradient id={idCSS} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor={color0} />
          <stop offset="30%" stopColor={color30} />
          <stop offset="50%" stopColor={color50} />
          <stop offset="80%" stopColor={color80} />
          <stop offset="100%" stopColor={color100} />
        </linearGradient>
      </defs>
    </svg>
  );
};
export const NftTraits = ({ traits }: NFtTraitsProps) => {
  const styles = useStyles();
  return (
    <Grid item container justifyContent="flex-start" spacing={3}>
      <GradientSVG />
      {traits.map((trait: any, i: any) => (
        <Grid item container xs={3} key={trait.traitType + i}>
          <Card className={styles.traitCard}>
            <div style={{ height: '50%' }}>
              <Typography variant="body1" className={styles.traitType}>
                {trait.traitType}
              </Typography>
            </div>
            <div className={styles.traitFooter}>
              <Typography variant="body1" className={styles.value}>
                {trait.value}
              </Typography>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
