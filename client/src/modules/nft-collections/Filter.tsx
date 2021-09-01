import { Button, Grid, TextField } from '@material-ui/core';

export function Filter() {
  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <TextField variant="outlined" />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary">
          Blockchain
        </Button>
      </Grid>
    </Grid>
  );
}
