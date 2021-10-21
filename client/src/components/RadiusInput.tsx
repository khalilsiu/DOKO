import OutlinedInput from '@material-ui/core/OutlinedInput';
import withStyles from '@material-ui/core/styles/withStyles';

export const RadiusInput = withStyles({
  root: {
    '& input::placeholder': {
      fontSize: 12,
    },
    fontSize: 12,
  },
  notchedOutline: {
    border: 'none',
  },
})(OutlinedInput);

export default RadiusInput;
