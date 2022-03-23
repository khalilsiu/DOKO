import React from 'react';
import { Tabs, Tab, makeStyles, Box, Divider } from '@material-ui/core';
import { ParcelTransactionHistory } from './ParcelTransactionHistory';

export const DetailTabs = React.memo(() => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Tabs textColor="primary" indicatorColor="primary" value="parcel">
        <Tab
          classes={{ selected: classes.selectedTab }}
          className={classes.tab}
          label="Parcel Details"
          value="parcel"
        />
        {/* <Tab disabled classes={{ disabled: classes.disabledTab }} className={classes.tab} label="District Details" /> */}
      </Tabs>
      <Divider className={classes.divider} />
      <ParcelTransactionHistory />
    </Box>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  tab: {
    color: 'rgba(255,255,255,0.75)',
  },
  selectedTab: {
    fontWeight: 'bold',
  },
  disabledTab: {
    color: 'rgba(255,255,255,0.75) !important',
  },
  divider: {
    [theme.breakpoints.up('lg')]: {
      marginLeft: -theme.spacing(4),
      marginRight: -theme.spacing(4),
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: -theme.spacing(2),
      marginRight: -theme.spacing(2),
    },
    position: 'relative',
    height: 1,
    top: -1,
    zIndex: -1,
  },
}));
