import { withStyles, Select, Theme, MenuItem, Input, Typography, makeStyles } from '@material-ui/core';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';

export const StyledSelect = withStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '30px',
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: '15px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    '&:focus': {
      backgroundColor: 'transparent',
      borderRadius: '15px',
      borderBottom: 'none',
    },
  },
  icon: {
    color: 'white',
  },
}))(Select);

export const StyledMenuItem = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: 'black !important',
    '&:hover': {
      backgroundColor: `${theme.palette.grey[800]} !important`,
    },
  },
  gutters: {
    backgroundColor: 'black !important',
  },
  selected: {
    backgroundColor: `${theme.palette.grey[800]} !important`,
  },
}))(MenuItem);

interface ILeaseLengthSelect {
  finalLeaseLength: number;
  handleSelectChange: (e: any) => void;
  leaseLengths: number[];
}

const LeaseLengthSelect = ({ finalLeaseLength, handleSelectChange, leaseLengths }: ILeaseLengthSelect) => {
  const { isTransacting, isLoading } = useSelector((state: RootState) => state.appState);
  const styles = useStyles();

  return (
    <StyledSelect
      value={finalLeaseLength}
      defaultValue=""
      variant="outlined"
      onChange={handleSelectChange}
      fullWidth
      label="Months"
      MenuProps={{ classes: { list: styles.menu } }}
      input={<Input className={styles.underline} />}
      style={{ height: '30px' }}
      disabled={isTransacting || isLoading}
    >
      {leaseLengths.map((leaseLength) => (
        <StyledMenuItem key={leaseLength} value={leaseLength}>
          <Typography variant="body2" className={styles.selectValue}>
            {leaseLength} months
          </Typography>
        </StyledMenuItem>
      ))}
    </StyledSelect>
  );
};

const useStyles = makeStyles((theme) => ({
  underline: {
    '&:before': {
      borderBottom: 'none',
    },
    '&:after': {
      borderBottom: 'none',
    },
    '&:focus': {
      borderBottom: 'none',
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },
  },
  selectValue: {
    color: theme.palette.grey[400],
  },
  menu: {
    backgroundColor: 'black',
    maxHeight: '30vh',
  },
}));

export default memo(LeaseLengthSelect);
