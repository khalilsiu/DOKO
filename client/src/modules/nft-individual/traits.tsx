import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { Card, Grid, makeStyles, Typography } from '@material-ui/core';

interface NFtTraitsProps {
  traits: any;
}

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
  // eslint-disable-next-line no-use-before-define
  const styles = useStyles();

  return (
    <Grid container justifyContent="flex-start" spacing={3} className="traits">
      <GradientSVG />
      {traits.map((trait: any) => {
        const traitPercentage = Math.round((trait.trait_count / 7000) * 100);
        return (
          <Grid item container lg={2} xl={2} md={4} sm={3} xs={3}>
            <Card className={styles.traitCard}>
              <div style={{ marginBottom: '1em' }}>
                <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
                  {trait.trait_type}
                </Typography>
              </div>
              <CircularProgressbar
                value={traitPercentage}
                text={`${traitPercentage}%`}
                styles={{
                  path: {
                    stroke: 'url(#lingrad)',
                  },
                  trail: {
                    stroke: '#333333',
                  },
                  text: {
                    fill: 'white',
                    fontSize: '16px',
                  },
                }}
              />
              <div style={{ textAlign: 'center', marginTop: '1em' }}>
                <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
                  {trait.value}
                </Typography>
                <Typography variant="body1" style={{ fontStyle: 'italic' }}>
                  {traitPercentage} % have this trait
                </Typography>
              </div>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

const useStyles = makeStyles(() => ({
  traits: {},
  traitCard: {
    padding: '1.5em',
    background: 'inherit',
    display: 'flex',
    minHeight: '250px',
    width: '100%',
    flexDirection: 'column',
    borderRadius: '20px',
    border: '1px solid white',
    alignItems: 'center',
  },
}));
