import React from 'react'
import { PaperProvider } from 'react-native-paper'; 
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './pages/login'
import Home from './pages/home';
import SampleEvent from './pages/sampleEvent';
import Event from './pages/event';

const Stack = createStackNavigator()

export default function App() {
  return (
    <PaperProvider>
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