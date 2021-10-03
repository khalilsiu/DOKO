import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Card, Grid, makeStyles, Typography } from '@material-ui/core';

interface NFtTraitsProps {
  traits: any;
  totalSupply: any;
}

const useStyles = makeStyles((theme) => ({
  traits: {},
  traitFooter: {
    marginTop: '1em',
    textAlign: 'center',
  },
  traitCard: {
    padding: '1.5em',
    background: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '200px',
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
export const NftTraits = ({ traits, totalSupply }: NFtTraitsProps) => {
  const styles = useStyles();
  return (
    <Grid container justifyContent="flex-start" spacing={3} className="traits">
      <GradientSVG />
      {traits.map((trait: any) => {
        const traitPercentage =
          trait.trait_count && totalSupply
            ? Math.round((trait.trait_count / totalSupply) * 100)
            : 0;
        const traitPercentageAvailable = !!traitPercentage;
        const traitPercentageText = traitPercentageAvailable ? `${traitPercentage} %` : 'N/A';
        return (
          <Grid item container lg={2} xl={2} md={3} sm={3} xs={6} key={trait.trait_type}>
            <Card className={styles.traitCard}>
              <div style={{ marginBottom: '1em' }}>
                <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
                  {trait.trait_type}
                </Typography>
              </div>
              <CircularProgressbar
                value={traitPercentage}
                text={`${traitPercentageText}`}
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
              <div className={styles.traitFooter}>
                <Typography variant="body1" style={{ fontWeight: 'bolder' }}>
                  {trait.value}
                </Typography>
                <Typography variant="body1" style={{ fontStyle: 'italic' }}>
                  {traitPercentage ? `${traitPercentage} %` : 'N/A'} have this trait
                </Typography>
              </div>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
