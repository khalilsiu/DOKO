import {
  Button,
  makeStyles,
  useMediaQuery,
  Theme,
  Typography,
  useTheme,
  withStyles,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { DataGrid } from '@mui/x-data-grid';
import RadiusInput from 'components/RadiusInput';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { forwardRef } from 'react';
import { DclStats } from '../../store/stats/dclStatsSlice';

interface IStatsView {
  stats: DclStats[];
  isLoading: boolean;
}

interface QuickSearchToolbarProps {
  clearSearch: () => void;
  onChange: (e) => void;
  value: string;
}

const escapeRegExp = (value: string): string => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

const useStyles = makeStyles((theme: Theme) => ({
  menuItem: {
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#EBEBEB',
    },
  },
  resultsText: {
    color: theme.palette.grey[500],
    fontSize: '0.8rem',
    fontStyle: 'italic',
    marginBottom: '0.4rem',
  },
  timeframeMenu: {
    position: 'absolute',
    right: 0,
    boxShadow: 'rgb(4 17 29 / 25%) 0px 0px 8px 0px',
    borderRadius: '10px',
    overflow: 'hidden',
    padding: '0.5rem 0 0.5rem 0',
    backgroundColor: 'white',
    minWidth: 'content-fit',
    zIndex: 10000,
  },
  statsTable: {
    height: '700px',
    borderRadius: '10px',
    overflow: 'hidden',
    padding: '0.5rem 0 0.5rem 0',
    backgroundColor: 'white',
    minWidth: 'content-fit',
  },
}));

export const timeframeOptions = [
  {
    id: 'ytd',
    label: 'Yesterday',
  },
  {
    id: 'weekly',
    label: '7D',
  },
  {
    id: 'monthly',
    label: '30D',
  },
  {
    id: 'all',
    label: 'All',
  },
];

const columns = [
  { field: 'coordinates', headerName: 'Coordinates', width: 160 },
  { field: 'ytdUsers', headerName: 'Ytd Users', width: 250 },
  { field: 'ytdSessions', headerName: 'Ytd Sessions', width: 250 },
  { field: 'ytdMedianSessionTime', headerName: 'Ytd Median Session Time', width: 250 },
  { field: 'ytdMaxConcurrentUsers', headerName: 'Ytd Max Concurrent Users', width: 250 },
  { field: 'weeklyUsers', headerName: '7D Users', width: 250 },
  { field: 'weeklySessions', headerName: '7D Sessions', width: 250 },
  { field: 'weeklyMedianSessionTime', headerName: '7D Median Session Time', width: 250 },
  { field: 'weeklyMaxConcurrentUsers', headerName: '7D Max Concurrent Users', width: 250 },
  { field: 'monthlyUsers', headerName: '30D Users', width: 250 },
  { field: 'monthlySessions', headerName: '30D Sessions', width: 250 },
  { field: 'monthlyMedianSessionTime', headerName: '30D Median Session Time', width: 250 },
  { field: 'monthlyMaxConcurrentUsers', headerName: '30D Max Concurrent Users', width: 250 },
];

const StyledButton = withStyles((theme: Theme) => ({
  root: {
    minWidth: '300px',
    borderWidth: '2px',
    [theme.breakpoints.down('md')]: {
      minWidth: '100px',
    },
  },
}))(Button);

const QuickSearchToolbar = (props: QuickSearchToolbarProps) => (
  <RadiusInput
    value={props.value}
    onChange={props.onChange}
    placeholder="Search…"
    startAdornment={<SearchIcon fontSize="small" />}
    endAdornment={
      <IconButton
        title="Clear"
        aria-label="Clear"
        size="small"
        style={{ visibility: props.value ? 'visible' : 'hidden' }}
        onClick={props.clearSearch}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
    }
  />
);

const StatsView = forwardRef<HTMLDivElement, IStatsView>(({ stats, isLoading }: IStatsView) => {
  const styles = useStyles();
  const theme = useTheme();
  const [timeframeOpen, setTimeframeOpen] = useState(false);
  const [timeframeSelected, setTimeframeSelected] = useState(timeframeOptions[0].id);
  const mdOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const ref = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = React.useState('');
  const [rows, setRows] = React.useState<DclStats[]>(stats);

  const requestSearch = (searchValue: string) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = stats.filter((row: DclStats) => {
      return searchRegex.test(row.coordinates.toString());
    });
    setRows(filteredRows);
  };

  const handleTimeframeChange = (newTimeframeId: string) => {
    setTimeframeOpen(false);
    setTimeframeSelected(newTimeframeId);
  };

  const handleOffMenuClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setTimeframeOpen(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousedown', handleOffMenuClick);
    }
    return () => {
      window.removeEventListener('mousedown', handleOffMenuClick);
    };
  }, []);

  useEffect(() => {
    setRows(stats);
  }, [stats]);

  const columnsDisplayed = useMemo(() => {
    return columns.filter(
      (column) =>
        // show all columns when timeframe selected is all
        timeframeSelected === 'all' ||
        // always show coordinates column
        column.field === 'coordinates' ||
        // show columns corresponding to timeframe selected
        column.field.includes(timeframeSelected),
    );
  }, [columns, timeframeSelected]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <QuickSearchToolbar
          value={searchText}
          onChange={(event) => requestSearch(event.target.value)}
          clearSearch={() => requestSearch('')}
        />
        <div style={{ position: 'relative' }}>
          <StyledButton
            className="gradient-button"
            disabled={false}
            variant="outlined"
            onClick={() => setTimeframeOpen(!timeframeOpen)}
            style={{}}
          >
            {mdOrAbove && timeframeOptions.find((item) => item.id === timeframeSelected)?.label}
            <ArrowDropDownIcon />
          </StyledButton>
          {timeframeOpen && (
            <div className={styles.timeframeMenu} ref={ref}>
              {timeframeOptions.map((timeframe, index) => (
                <MenuItem
                  value={index}
                  onClick={() => handleTimeframeChange(timeframe.id)}
                  className={styles.menuItem}
                  style={timeframe.id === timeframeSelected ? { backgroundColor: theme.palette.grey[300] } : {}}
                  key={timeframe.id}
                >
                  {timeframe.label}
                </MenuItem>
              ))}
            </div>
          )}
        </div>
      </div>
      <Typography variant="subtitle2" className={styles.resultsText}>
        Results showing: {stats.length} listings
      </Typography>
      <DataGrid
        className={styles.statsTable}
        rows={rows}
        columns={columnsDisplayed}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event) => requestSearch(event.target.value),
            clearSearch: () => requestSearch(''),
          },
        }}
        pageSize={40}
        columnBuffer={10}
        loading={isLoading}
      />
    </div>
  );
});

export default StatsView;
