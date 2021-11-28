import { createTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { blue } from '@material-ui/core/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
    },
    secondary: {
      main: green[500],
    },
  },
});