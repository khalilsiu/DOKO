import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { FilterTabs } from './FilterTabs';
import { useParcelTransactionHistoryStore } from 'modules/meta-nft-individual/hooks/useParcelTransactionHistoryStore';
import { useParams } from 'react-router-dom';
import { Title } from './Title';
import { Table } from './Table';

export const ParcelTransactionHistory = React.memo(() => {
  const classes = useStyles();
  const { address, id } = useParams<{ address: string; id: string; chain: string }>();
  const fetchParcelTransactionHistory = useParcelTransactionHistoryStore((state) => state.fetch);

  React.useEffect(() => {
    fetchParcelTransactionHistory(address, id);
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
