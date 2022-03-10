import React from 'react';
import { Box, Divider, makeStyles, Tab, Tabs } from '@material-ui/core';
import {
  fetchParcelTransactionHistory,
  ParcelTransactionHistoryCategory,
  parcelTransactionHistoryEventMap,
  parcelTransactionHistorySlice,
  useParcelTransactionHistorySliceSelector,
} from 'store/asset/parcelTransactionHistorySlice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

export const FilterTabs = React.memo(() => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { address, id } = useParams<{ address: string; id: string; chain: string }>();

  const currentTab = useParcelTransactionHistorySliceSelector((state) => state.currentTab);
  const changeTab = React.useCallback((tab: ParcelTransactionHistoryCategory) => {
    dispatch(parcelTransactionHistorySlice.actions.changeTab(tab));
    address &&
      id &&
      dispatch(
        fetchParcelTransactionHistory({
          contractAddress: address,
          assetId: id,
        }),
      );
  }, []);

  return (
    <Box className={classes.root}>
      <Tabs textColor="primary" indicatorColor="primary" value={currentTab} onChange={(_, key) => changeTab(key)}>
        {Object.keys(parcelTransactionHistoryEventMap).map((tabKey, index) => (
          <Tab
            key={index}
            classes={{ selected: classes.selectedTab }}
            className={classes.tab}
            label={tabKey}
            tabIndex={tabKey}
            value={tabKey}
          />
        ))}
      </Tabs>
      <Divider className={classes.divider} />
    </Box>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(3),
  },
  tab: {
    color: 'rgba(255,255,255,0.75)',
    minWidth: 100,
    maxWidth: 100,
  },
  selectedTab: {
    fontWeight: 'bold',
  },
  disabledTab: {
    color: 'rgba(255,255,255,0.75) !important',
  },
  divider: {
    position: 'relative',
    height: 1,
    top: -1,
    zIndex: -1,
  },
}));
