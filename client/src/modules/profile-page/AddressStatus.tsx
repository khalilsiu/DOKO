import { CircularProgress, Grid, Typography } from '@material-ui/core';

interface Props {
  status: any;
  loader: boolean;
}

export const AddressStatus = ({ status, loader = true }: Props) => {
  if (!status) {
    return <CircularProgress />;
  }

  switch (status.sync_status) {
    case 'done':
    case 'empty':
      return loader ? <Typography variant="h6">No Items</Typography> : <></>;
    case 'progress':
    case 'new':
      return loader ? (
        <CircularProgress />
      ) : (
        <Grid container alignItems="center" justifyContent="flex-end">
          <CircularProgress
            variant="determinate"
            color="primary"
            value={status.sync_progress || 0}
            size={24}
          />
          <Typography style={{ marginLeft: 12 }} variant="body1">
            Syncing the NFTs...
          </Typography>
        </Grid>
      );
    default:
      return <></>;
  }
};

export default AddressStatus;
