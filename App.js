import React from 'react'
import { PaperProvider, MD3LightTheme as DefaultTheme, } from 'react-native-paper'; 
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './pages/login'
import Home from './pages/home';
import SampleEvent from './pages/sampleEvent';
import NextEventCounter from './components/nextEventCounter';
import Event from './pages/event';

const Stack = createStackNavigator()

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    primary : '#3A0CA3',
    secondary : '#FF7F50',
    background : '#F8F6F3',
    onBackground : "#3A0CA3",
    tertiary : "#E7CDE1",
    "light_orange": "#FFD580",
    "dark_purple": "#3A0CA3",
    light_purple: "#E7CDE1",
    "cream_white": "#F8F6F3",
    myOwnColor: '#BADA55',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}  
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Sample-Event" component={SampleEvent} />
          <Stack.Screen name="Event" component={Event} />
        </Stack.Navigator>
      </NavigationContainer>
      </PaperProvider>
  )
}