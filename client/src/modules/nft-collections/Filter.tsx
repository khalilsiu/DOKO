import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  makeStyles,
  MenuItem,
  MenuList,
  OutlinedInput,
  Typography
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { ArrowDropDown, ArrowDropUp, Search } from '@material-ui/icons';
import { useEffect, useRef, useState } from 'react';

import Popover from '../../components/Popover';

const chains = [
  {
    name: 'all',
    label: 'All'
  },
  {
    name: 'eth',
    label: 'Ethereum'
  },
  {
    name: 'bsc',
    label: 'BSC'
  },
  {
    name: 'polygon',
    label: 'Polygon'
  }
];

const sorts = [
  {
    name: 'name',
    order: 1,
    label: 'A to Z'
  },
  {
    name: 'name',
    order: -1,
    label: 'Z to A'
  }
];

type ChainKey = 'all' | 'eth' | 'bsc' | 'polygon';

interface FilterProps {
  onChange: (filter: any) => void;
}

let termTimeout: any;

export function Filter({ onChange }: FilterProps) {
  const styles = useStyles();
  const [filter, setFilter] = useState({
    term: '',
    chain: {
      all: true,
      eth: false,
      bsc: false,
      polygon: false
    },
    sort: sorts[0]
  });
  const firstRun = useRef(true);

  const updateChain = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    if (name === 'all') {
      setFilter(state => ({
        ...state,
        chain: {
          all: checked,
          eth: checked,
          bsc: checked,
          polygon: checked
        }
      }));
    } else {
      const chain = { ...filter.chain };
      chain[name as ChainKey] = checked;

      if (chain.eth && chain.bsc && chain.polygon) {
        chain.all = true;
      } else {
        chain.all = false;
      }
      setFilter(state => ({
        ...state,
        chain
      }));
    }
  };

  const updateTerm = (term: string) => {
    setFilter(state => ({
      ...state,
      term
    }));
  };

  const updateSort = (sort: any) => {
    setFilter(state => ({
      ...state,
      sort
    }));
    applyFilter({
      ...filter,
      sort
    });
  };

  const applyFilter = (options?: any) => {
    const data = options || filter;

    onChange({
      term: data.term,
      chain: data.chain.all
        ? ['eth', 'bsc', 'polygon']
        : Object.entries(data.chain)
            .map(([key, value]) => (key === 'all' || !value ? null : key))
            .filter(Boolean),
      orderBy: data.sort.name,
      direction: data.sort.order
    });
  };

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    clearTimeout(termTimeout);
    termTimeout = setTimeout(() => applyFilter(), 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.term]);

  return (
    <Grid container spacing={2} direction="column" style={{ paddingTop: 24, paddingBottom: 36 }}>
      <Grid item>
        <FormControl>
          <OutlinedInput
            value={filter.term}
            placeholder="Search your collection"
            startAdornment={
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            }
            onChange={e => updateTerm(e.target.value)}
          />
        </FormControl>
      </Grid>
      <Grid item>
        <Grid container justifyContent="space-between">
          <Popover
            reference={
              <Button variant="contained" color="primary">
                Blockchain
              </Button>
            }
          >
            <Grid container direction="column" style={{ minWidth: 200 }}>
              <FormControl style={{ paddingLeft: 16, paddingTop: 12 }} component="fieldset">
                <FormGroup>
                  {chains.map(chain => (
                    <FormControlLabel
                      key={chain.name}
                      className={styles.controlLabel}
                      control={
                        <Checkbox
                          color="primary"
                          checked={filter.chain[chain.name as ChainKey]}
                          name={chain.name}
                          onChange={e => updateChain(e)}
                        />
                      }
                      label={chain.label}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              <Divider />
              <Grid
                container
                justifyContent="flex-end"
                style={{ paddingTop: 12, paddingBottom: 8, paddingRight: 12 }}
              >
                <Button variant="outlined" color="primary" onClick={() => applyFilter()}>
                  Apply
                </Button>
              </Grid>
            </Grid>
          </Popover>
          <Popover
            reference={
              <Button variant="contained" color="primary">
                Sort By: {filter.sort.label}
                {filter.sort.order === 1 ? <ArrowDropUp /> : <ArrowDropDown />}
              </Button>
            }
            placement="bottom-end"
          >
            <MenuList>
              {sorts.map(sort => (
                <MenuItem
                  className={sort.label === filter.sort.label ? 'selected' : ''}
                  key={sort.label}
                  style={{ minWidth: 180 }}
                  onClick={() => updateSort(sort)}
                >
                  {sort.label}
                </MenuItem>
              ))}
            </MenuList>
          </Popover>
        </Grid>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  controlLabel: {
    marginBottom: theme.spacing(1),
    color: 'black',
    fontSize: 12,
    '& > span:last-child': {
      color: 'black'
    }
  }
}));
