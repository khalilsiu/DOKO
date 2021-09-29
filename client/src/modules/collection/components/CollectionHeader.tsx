import { Grid, IconButton, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  headerContainer: {
    padding: '36px 96px',
  },
}));

interface Props {
  collection: any;
}

export default function CollectionHeader({ collection }: Props) {
  const styles = useStyles();

  return collection ? (
    <Grid className={styles.headerContainer}>
      <Grid container justifyContent="flex-end">
        <IconButton />
      </Grid>
    </Grid>
  ) : (
    <></>
  );
}
