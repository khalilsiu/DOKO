import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { memo } from 'react';

const useStyles = makeStyles(() => ({
  wrapper: {
    position: 'fixed',
    background: 'rgba(255, 255, 255, 0.5)',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const Loading = memo(() => {
  const classes = useStyles();

  return (
    <div style={{ height: '100vh' }}>
      <div className={classes.wrapper}>
        <CircularProgress />
      </div>
    </div>
  );
});

export default Loading;
