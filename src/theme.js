import { createMuiTheme } from '@material-ui/core/styles';
// eslint-disable-next-line
import { red, blueGrey } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: {
      main: red.A200,
    },
    error: {
      main: red.A400,
    },
    type: 'dark'
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: 20
      }
    }
  }
});

export default theme;