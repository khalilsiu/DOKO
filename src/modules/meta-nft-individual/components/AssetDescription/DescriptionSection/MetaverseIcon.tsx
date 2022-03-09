import React from 'react';
import DecentralandIcon from 'assets/decentraland.png';
import TheSandboxIcon from 'assets/thesandbox.png';
import CryptovoxelsIcon from 'assets/cryptovoxels.png';
import SomniumIcon from 'assets/somnium.png';
import { makeStyles } from '@material-ui/core';

interface Props {
  metaverseName: string | null;
}

const iconMap = {
  Decentraland: DecentralandIcon,
  'The Sandbox': TheSandboxIcon,
  Cryptovoxels: CryptovoxelsIcon,
  'Somnium Space': SomniumIcon,
};

export const MetaverseIcon = React.memo<Props>(({ metaverseName }) => {
  const classes = useStyles();

  if (!metaverseName || !iconMap[metaverseName]) {
    return null;
  }

  return <img className={classes.root} src={iconMap[metaverseName]} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: 20,
    height: 'auto',
    marginRight: theme.spacing(1),
  },
}));
