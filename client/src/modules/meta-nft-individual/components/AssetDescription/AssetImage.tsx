import { makeStyles } from '@material-ui/core';
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface Props {
  imageUrl: string;
}

export const AssetImage = React.memo<Props>(({ imageUrl }) => {
  const classes = useStyles();

  return (
    <LazyLoadImage
      className={classes.image}
      wrapperClassName={classes.lazyloadwrapper}
      alt=""
      src={imageUrl}
      effect="opacity"
    />
  );
});

const useStyles = makeStyles({
  image: {
    borderRadius: 12,
    border: '3px solid rgba(255,255,255,0.5)',
    width: '100%',
    '& > svg': {
      width: '100%',
      height: 'auto',
    },
  },
  lazyloadwrapper: {
    display: 'flex !important',
    textAlign: 'center',
    width: '100%',
  },
});
