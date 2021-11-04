import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Card, Grid, makeStyles, Typography } from '@material-ui/core';

import eth from './assets/eth.png';
import bsc from './assets/bsc.png';
import polygon from './assets/polygon.png';
import solana from './assets/solana.png';

interface AddressProps {
    address: [string, string];
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
    height: '120px',
    maxHeight: '250px',
    width: '100%',
    borderRadius: '20px',
    border: '1px solid white',
    alignItems: 'center',
    color: 'inherit',
  },
}));

type Icons = {
  [key: string]: string
}
const icon: Icons = {
  eth,
  bsc,
  polygon,
  solana,
};

export const Address = ({ address }: AddressProps) => {
  const styles = useStyles();
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      wrap="nowrap"
      style={{ height: '20%', paddingLeft: '5%', paddingRight: '5%' }}
    >
      <img width={20} src={icon[address[0]]} alt={address[0]} style={{ borderRadius: '50%', marginRight: 10 }} />
      <Typography noWrap style={{ fontSize: '18px', fontFamily: 'Open Sans' }}>{address[1]}</Typography>
    </Grid>
  );
};

export default Address;
