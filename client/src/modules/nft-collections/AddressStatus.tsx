import { CircularProgress, LinearProgress, Typography } from '@material-ui/core';

interface Props {
  status: any;
}

export const AddressStatus = ({ status }: Props) => {
  if (!status) {
    return <CircularProgress />;
  }

  switch (status.sync_status) {
    case 'done':
    case 'empty':
      return <Typography variant="h6">No Items</Typography>;
    case 'progress':
    case 'new':
      return (
        <>
          <Typography variant="h6" gutterBottom>
            Syncing the NFTs...
          </Typography>
          <LinearProgress variant="determinate" color="primary" value={status.sync_progress || 0} />
        </>
      );
    default:
      return <></>;
  }
};
