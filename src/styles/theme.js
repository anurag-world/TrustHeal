import { extendTheme } from 'native-base';

const theme = extendTheme({
  colors: {
    primary: {
      default: '#e8f0fe',
    },
    secondary: {
      default: '#2b8ada',
    },
    light: {
      default: '#ffffff',
    },
    dark: {
      default: '#636464',
    },
    border: {
      default: '#2b8ada',
    },
    text: {
      primary: '#636464',
      secondary: '#2b8ada',
    },
  },
});

export default theme;
