import 'react-circular-progressbar/dist/styles.css';
import { Card, Grid, makeStyles, Typography } from '@material-ui/core';

interface NFtTraitsProps {
  traits: any;
  totalSupply: any;
}

const useStyles = makeStyles(() => ({
  traitFooter: {
    marginTop: '1em',
    textAlign: 'center',
  },
  traitCard: {
    padding: '1em',
    background: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '125px',
    maxHeight: '125px',
    width: '100%',
    borderRadius: '20px',
    border: '1px solid white',
    alignItems: 'center',
    color: 'inherit',
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
        <Grid item container lg={3} xl={3} md={4} sm={4} xs={6} key={trait.trait_type + i}>
          <Card className={styles.traitCard}>
            <div style={{ marginBottom: '1em' }}>
              <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
                {trait.trait_type}
              </Typography>
            </div>
            <div className={styles.traitFooter}>
              <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
                {trait.value}
              </Typography>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
