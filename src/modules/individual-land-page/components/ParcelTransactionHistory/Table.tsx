import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  makeStyles,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment';
import {
  fetchParcelTransactionHistory,
  ParcelTransactionHistory,
  useParcelTransactionHistorySliceSelector,
} from 'store/asset/parcelTransactionHistorySlice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

interface Column {
  key: keyof ParcelTransactionHistory;
  title: string;
  render?: (value: ParcelTransactionHistory[keyof ParcelTransactionHistory], row: ParcelTransactionHistory) => any;
}

export const Table = React.memo(() => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { address, id } = useParams<{ address: string; id: string }>();
  const currentTab = useParcelTransactionHistorySliceSelector((state) => state.currentTab);
  const result = useParcelTransactionHistorySliceSelector((state) => state.result);
  const isFetching = useParcelTransactionHistorySliceSelector((state) => state.fetching);
  const hasNext = useParcelTransactionHistorySliceSelector((state) => Boolean(state.nextCursor));

  const fetchMore = React.useCallback(() => {
    dispatch(fetchParcelTransactionHistory({ contractAddress: address, assetId: id }));
  }, [address, id]);

  const columns: Column[] = React.useMemo(() => {
    const fromAddressColumn: Column = {
      key: 'fromAddress',
      title: 'From',
      render(value) {
        return value;
      },
    };

    const toAddressColumn: Column = {
      key: 'toAddress',
      title: 'To',
      render(value) {
        return value;
      },
    };

    const priceColumn: Column = {
      key: 'price',
      title: 'Price',
      render(value, row) {
        if (!value) {
          return <span className={classes.italic}>N/A</span>;
        }

        return (
          <Box className={classes.flex}>
            {row.imageURL && <img className={classes.tokenIcon} src={row.imageURL} />}
            {value}
          </Box>
        );
      },
    };

    const parcel: Column = {
      key: 'parcel',
      title: 'Parcel',
    };

    const timeColumn: Column = {
      key: 'time',
      title: 'Time',
      render: (value) => moment(value).fromNow(),
    };

    switch (currentTab) {
      case 'sales':
        return [fromAddressColumn, toAddressColumn, priceColumn, parcel, timeColumn];
      case 'bids':
        return [fromAddressColumn, priceColumn, parcel, timeColumn];
      case 'transfers':
        return [fromAddressColumn, toAddressColumn, parcel, timeColumn];
    }
  }, [currentTab]);

  return (
    <React.Fragment>
      <TableContainer>
        <MuiTable
          className={classes.tableContainer}
          style={{ opacity: isFetching ? 0.5 : 1, filter: isFetching ? 'blur(1px)' : 'none' }}
        >
          <TableHead className={classes.tableHead}>
            <TableRow>
              {columns.map(({ title, key }) => (
                <TableCell key={key} className={clsx(classes.tableCell, classes.bold)}>
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {result.length === 0 ? (
              <TableRow>
                <TableCell className={clsx(classes.tableCell, classes.center)} colSpan={columns.length}>
                  No Data
                </TableCell>
              </TableRow>
            ) : (
              result.map((row, index) => (
                <TableRow key={index}>
                  {columns.map(({ key, render }) => (
                    <TableCell key={key} className={classes.tableCell}>
                      {typeof render === 'function' ? render(row[key], row) : row[key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {(hasNext || isFetching) && (
        <Box className={classes.loadMoreButtonContainer}>
          <Button
            className={classes.loadMoreButton}
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            onClick={fetchMore}
            disabled={isFetching}
          >
            {isFetching && (
              <CircularProgress className={classes.loadMoreButtonProgress} size={20} thickness={6} color="inherit" />
            )}
            {isFetching ? 'Loading More' : 'Load More'}
          </Button>
        </Box>
      )}
    </React.Fragment>
  );
});

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    minWidth: 800,
    overflowX: 'auto',
  },
  tableHead: {
    color: 'white',
    backgroundColor: '#2F2F2F',
  },
  tableCell: {
    color: 'white',
    borderBottom: 'solid 1px rgba(255,255,255,0.5)',
  },
  center: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  tokenIcon: {
    width: 10,
    marginRight: theme.spacing(1),
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  italic: {
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.5)',
  },
  loadingCell: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  pagination: {
    color: 'white',
  },
  paginationSelectIcon: {
    color: 'white',
  },
  loadMoreButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  loadMoreButton: {
    marginTop: theme.spacing(2),
    maxWidth: 200,
  },
  loadMoreButtonProgress: {
    marginRight: theme.spacing(1),
  },
}));
