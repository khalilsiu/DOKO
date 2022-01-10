import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Box,
  TableContainer,
  Table,
  TableBody,
  makeStyles,
  Theme,
  Typography,
  withStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { useState, useEffect, useMemo, ChangeEvent, MouseEvent } from 'react';
import dateFormat from 'dateformat';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import { isValidHttpUrl } from '../libs/utils';

interface StyleProps {
  page?: number;
  totalPages?: number;
}
const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  tableHead: {
    backgroundColor: theme.palette.grey[800],
  },
  tableHeaderTitle: {
    fontWeight: 700,
  },
  tablePaginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
    alignItems: 'center',
  },
  tableNavIcon: { color: theme.palette.secondary.main },
  leftPaginationBtnContainer: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    visibility: ({ page }) => (page === 0 ? 'hidden' : 'visible'),
  },
  rightPaginationBtnContainer: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    visibility: ({ page, totalPages }) => (page === totalPages ? 'hidden' : 'visible'),
  },
  daysFilter: {
    padding: '0.4rem 0.7rem',
    width: '3.5rem',
    borderRadius: '4px',
    border: 'solid 2px',
    marginLeft: '0.5rem',
    borderColor: theme.palette.grey[700],
    display: 'flex',
    justifyContent: 'center',
  },
  sectionTitle: { fontWeight: 700, marginBottom: '2rem' },
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | Date },
  b: { [key in Key]: number | string | Date },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  headCells: readonly HeadCell[];
  unsortableHeaderIds: string[];
  onRequestSort: (event: MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
}

const StyledTableSortLabel = withStyles({
  icon: {
    height: '1.5rem',
    width: '1.5rem',
    '& path': {
      fill: '#fff',
    },
  },
})(TableSortLabel);

function EnhancedTableHead({
  order,
  orderBy,
  headCells,
  unsortableHeaderIds,
  onRequestSort,
}: EnhancedTableProps) {
  const createSortHandler = (property: string) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  const classes = useStyles({});

  return (
    <TableHead className={classes.tableHead}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {unsortableHeaderIds.includes(headCell.id) ? (
              <Typography variant="body1" className={classes.tableHeaderTitle}>
                {headCell.label}
              </Typography>
            ) : (
              <StyledTableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                IconComponent={ArrowDropDown}
              >
                <Typography variant="body1" className={classes.tableHeaderTitle}>
                  {headCell.label}
                </Typography>
              </StyledTableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface IPaginationProps {
  page: number;
  handleChangePage: (page: number) => void;
  totalPages: number;
  rowsPerPage: number;
  rowOptions: number[];
  handleChangeRowsPerPage: (e: ChangeEvent<{ value: unknown }>) => void;
}

const StyledSelect = withStyles({
  root: {
    color: 'white',
  },
  icon: {
    color: 'white',
  },
})(Select);

function Pagination({
  page,
  handleChangePage,
  totalPages,
  rowsPerPage,
  rowOptions,
  handleChangeRowsPerPage,
}: IPaginationProps) {
  const classes = useStyles({ page, totalPages });

  return (
    <div className={classes.tablePaginationContainer}>
      <div
        className={classes.leftPaginationBtnContainer}
        onClick={() => handleChangePage(page - 1)}
      >
        <ArrowLeft className={classes.tableNavIcon} style={{ marginRight: '0.5rem' }} />
        <Typography variant="subtitle2">Previous</Typography>
      </div>
      <div>
        <Typography variant="body1" style={{ fontStyle: 'italic' }}>
          {`Page ${page + 1} of ${totalPages + 1}`}
        </Typography>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
          <Typography variant="body1" style={{ fontStyle: 'italic' }}>
            Rows per page
          </Typography>
          <StyledSelect color="secondary" value={rowsPerPage} onChange={handleChangeRowsPerPage}>
            {rowOptions.map((row) => (
              <MenuItem value={row}>{row}</MenuItem>
            ))}
          </StyledSelect>
        </div>
        <div
          className={classes.rightPaginationBtnContainer}
          onClick={() => handleChangePage(page + 1)}
        >
          <Typography variant="subtitle2" style={{ marginRight: '0.5rem' }}>
            Next
          </Typography>
          <ArrowRight className={classes.tableNavIcon} />
        </div>
      </div>
    </div>
  );
}

export interface HeadCell {
  id: string;
  label: string;
  numeric: boolean;
}
interface IProps {
  rows: { [key in string]: number | string | Date }[];
  headCells: readonly HeadCell[];
  unsortableHeaderIds: string[];
  dateFilterHeaderId: string;
  tableTitle: string;
  priceHeaderIds: string[];
}

export default function EnhancedTable({
  rows,
  headCells,
  unsortableHeaderIds,
  dateFilterHeaderId,
  tableTitle,
  priceHeaderIds,
}: IProps) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('price');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [daysToFilter, setDaysToFilter] = useState<number | string>('all');
  const classes = useStyles({});

  useEffect(() => {
    setPage(0);
  }, [daysToFilter]);

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<{ value: unknown }>) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(0);
  };

  const filteredRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).filter((row) => {
        if (daysToFilter === 'all') return row;
        const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));
        return (
          row[dateFilterHeaderId] < endOfToday &&
          row[dateFilterHeaderId] >
            new Date(endOfToday.setDate(endOfToday.getDate() - (daysToFilter as number)))
        );
      }),
    [rows, order, orderBy, daysToFilter, dateFilterHeaderId],
  );

  const daysFilter = [
    {
      label: '1D',
      value: 1,
    },
    {
      label: '7D',
      value: 7,
    },
    {
      label: '30D',
      value: 30,
    },
    {
      label: '90D',
      value: 90,
    },
    {
      label: 'All',
      value: 'all',
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" className={classes.sectionTitle}>
          {tableTitle}
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {daysFilter.map((days) => (
            <div
              className={classes.daysFilter}
              onClick={() => setDaysToFilter(days.value)}
              style={{ ...(days.value === daysToFilter && { borderColor: 'white' }) }}
            >
              <Typography variant="subtitle2" style={{ fontWeight: 700 }}>
                {days.label}
              </Typography>
            </div>
          ))}
        </div>
      </div>
      <Box sx={{ width: '100%' }}>
        <TableContainer>
          <Table size="medium">
            <EnhancedTableHead
              headCells={headCells}
              unsortableHeaderIds={unsortableHeaderIds}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    {Object.keys(row).map((key) => {
                      const isNumber = typeof row[key] === 'number';
                      const isDate = row[key] instanceof Date;
                      let isValidUrl = false;
                      if (typeof row[key] === 'string') {
                        isValidUrl = isValidHttpUrl(row[key] as string);
                      }
                      return (
                        <TableCell align={isNumber || isValidUrl ? 'center' : 'left'} scope="row">
                          {isDate ? (
                            <Typography variant="body1">
                              {dateFormat(row[key], 'dd/mm/yyyy, HH:mm')}
                            </Typography>
                          ) : isValidUrl ? (
                            <a href={row[key] as string} target="_blank" rel="noopener noreferrer">
                              <img
                                height={20}
                                src="/DOKOasset_EtherScan.png"
                                alt=""
                                style={{ marginRight: '1rem' }}
                              />
                            </a>
                          ) : priceHeaderIds.includes(key) ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                height={20}
                                src="/landing/Ethereum.png"
                                alt=""
                                style={{ marginRight: '1rem' }}
                              />
                              <Typography variant="body1">{row[key]}</Typography>
                            </div>
                          ) : (
                            <Typography variant="body1">{row[key]}</Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          page={page}
          handleChangePage={handleChangePage}
          totalPages={Math.floor(filteredRows.length / rowsPerPage)}
          rowsPerPage={rowsPerPage}
          rowOptions={[5, 10, 15]}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Box>
    </div>
  );
}
