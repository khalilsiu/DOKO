import React, { ChangeEvent } from 'react';
import {
  Box,
  CircularProgress,
  makeStyles,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import {
  ParcelTransactionHistory,
  useParcelTransactionHistoryStore,
} from 'modules/meta-nft-individual/hooks/useParcelTransactionHistoryStore';
import clsx from 'clsx';
import moment from 'moment';

interface Column {
  key: keyof ParcelTransactionHistory;
  title: string;
  render?: (
    value: ParcelTransactionHistory[keyof ParcelTransactionHistory],
    row: ParcelTransactionHistory,
  ) => any;
}

export const Table = React.memo(() => {
  const classes = useStyles();
  const currentTab = useParcelTransactionHistoryStore((state) => state.currentTab);
  const result = useParcelTransactionHistoryStore((state) => state.result);
  const isFetching = useParcelTransactionHistoryStore((state) => state.fetching);
  const currentPage = useParcelTransactionHistoryStore((state) => state.currentPage);
  const rowsPerPage = useParcelTransactionHistoryStore((state) => state.rowsPerPage);

  const setCurrentPage = useParcelTransactionHistoryStore((state) => state.setCurrentPage);
  const setRowsPerPage = useParcelTransactionHistoryStore((state) => state.setRowsPerPage);

  const handleChangePage = React.useCallback((_: unknown, newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleChangeRowsPerPage = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  }, []);

  const columns: Column[] = React.useMemo(() => {
    const fromAddressColumn: Column = {
      key: 'fromAddress',
      title: 'From',
      render(value) {
        return value || <span className={classes.italic}>N/A</span>;
      },
    };

    const toAddressColumn: Column = {
      key: 'toAddress',
      title: 'To',
      render(value) {
        return value || <span className={classes.italic}>N/A</span>;
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
        return [fromAddressColumn, parcel, timeColumn];
      case 'transfers':
        return [fromAddressColumn, toAddressColumn, parcel, timeColumn];
    }
  }, [currentTab]);

  return (
    <React.Fragment>
      <TableContainer>
        <MuiTable className={clsx({ [classes.tableContainer]: !isFetching })}>
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
            {isFetching ? (
              <TableRow>
                <TableCell
                  className={clsx(classes.tableCell, classes.loadingCell)}
                  colSpan={columns.length}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              result
                .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                .map((row, index) => (
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={result.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className={classes.pagination}
        classes={{ selectIcon: classes.paginationSelectIcon }}
      />
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
}));
