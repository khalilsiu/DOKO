import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { FilterTabs } from './FilterTabs';
import { useParams } from 'react-router-dom';
import { Title } from './Title';
import { Table } from './Table';
import {
  fetchParcelTransactionHistory,
  useParcelTransactionHistorySliceSelector,
} from 'store/asset/parcelTransactionHistorySlice';
import { useDispatch } from 'react-redux';

export const ParcelTransactionHistory = React.memo(() => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { address, id } = useParams<{ address: string; id: string }>();
  const fetchCalled = useParcelTransactionHistorySliceSelector((state) => state.fetchCalled);

  React.useEffect(() => {
    if (!fetchCalled) {
      dispatch(fetchParcelTransactionHistory({ contractAddress: address, assetId: id }));
    }
  }, [address, id, fetchCalled]);

  return (
    <Box className={classes.root}>
      <Title />
      <FilterTabs />
      <Table />
    </Box>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(6),
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(4),
    },
  },
}));
