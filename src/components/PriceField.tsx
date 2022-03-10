import { Grid, Typography } from '@material-ui/core';
import { formatPrice } from '../utils/utils';

interface Props {
  title: string;
  value: number;
}

export default function PriceField({ title, value }: Props) {
  const disp = value > 1 ? formatPrice(+value, 2) : parseFloat(`${value}`).toFixed(2);

  return (
    <>
      <Typography variant="subtitle2">{title}</Typography>
      <Grid container alignItems="center" style={{ width: 'unset' }}>
        <img height={24} src="/collection/EthereumBlue.png" alt="" />
        <Typography style={{ marginLeft: 8, fontWeight: 700 }} variant="h5">
          {disp}
        </Typography>
      </Grid>
    </>
  );
}
