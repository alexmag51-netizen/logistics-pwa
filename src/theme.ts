import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0ea5e9',    // голубой акцент
    secondary: '#10b981',  // зеленый акцент
    surface: '#ffffff',
    background: '#fafafa'
  },
  roundness: 16
};
