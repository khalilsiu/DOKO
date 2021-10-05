import { Grid, Typography } from '@material-ui/core';

interface Props {
  title: string;
  value: number;
}

export default function PriceField({ title, value }: Props) {
  const disp = value && value > 1000 ? `${parseFloat(`${value / 1000}`).toFixed(1)}K` : value;

  return (
    <>
      <Typography variant="subtitle2">{title}</Typography>
      <Grid container alignItems="center">
        <img height={24} src="/collection/DOKOasset_EthereumBlue.png" alt="" />
        <Typography style={{ marginLeft: 8, fontWeight: 700 }} variant="h5">
          {disp}
        </Typography>
      </Grid>
    </>
  );
}
