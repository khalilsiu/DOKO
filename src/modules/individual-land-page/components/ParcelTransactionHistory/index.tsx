import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { FilterTabs } from './FilterTabs';
import { useParams } from 'react-router-dom';
import { Title } from './Title';
import { Table } from './Table';
import { fetchParcelTransactionHistory } from 'store/asset/parcelTransactionHistorySlice';
import { useDispatch } from 'react-redux';

export const ParcelTransactionHistory = React.memo(() => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { address, id } = useParams<{ address: string; id: string; chain: string }>();

  React.useEffect(() => {
    dispatch(fetchParcelTransactionHistory({ contractAddress: address, assetId: id }));
  }, [address, id]);

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
