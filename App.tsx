import React from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { NativeBaseProvider } from 'native-base';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './src/styles/theme';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        backgroundColor={
          Platform.OS === 'android' ? theme.colors.secondary.default : theme.colors.primary.default
        }
      />
      <AppNavigator />
    </NativeBaseProvider>
  );
}

export default App;
