import { Grid, Typography } from '@material-ui/core';

interface Props {
  title: string;
  value: number;
}

export default function TweetField({ title, value }: Props) {
  return (
    <>
      <Typography variant="subtitle2">{title}</Typography>
      <Grid container alignItems="center">
        <img height={24} src="/collection/DOKOasset_TwitterBlackCircle.png" alt="" />
        <Typography style={{ marginLeft: 8, fontWeight: 700 }} variant="h5">
          {value}
        </Typography>
      </Grid>
    </>
  );
}
