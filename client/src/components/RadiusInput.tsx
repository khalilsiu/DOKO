import { OutlinedInput, withStyles } from '@material-ui/core';

export const RadiusInput = withStyles({
  root: {
    '& input::placeholder': {
      fontSize: 12
    },
    fontSize: 12
  },
  notchedOutline: {
    border: 'none'
  }
})(OutlinedInput);
