import React from 'react';
import { Hidden, IconButton, Link, makeStyles } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

interface Props {
  url: string;
  mataverseName: string;
}

export const ExternalLink = React.memo<Props>(({ url, mataverseName }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Hidden xsDown>
        <Link className={classes.root} href={url} target="_blank">
          View on {mataverseName}
        </Link>
      </Hidden>
      <Hidden smUp>
        <IconButton size="small" className={classes.iconButton} href={url} target="_blank">
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Hidden>
    </React.Fragment>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    fontStyle: 'italic',
    fontSize: '0.8rem',
    position: 'relative',
    top: '0.1rem',
    color: theme.palette.secondary.main,
  },
  iconButton: {
    marginLeft: theme.spacing(1),
    backgroundColor: 'white !important',
    color: 'black',
  },
}));
