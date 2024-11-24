import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { startLocationAndNotifications } from './services/NotificationService';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    startLocationAndNotifications().catch(console.error);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: 'Nearby Discounts',
            headerStyle: {
              backgroundColor: '#ff6347',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
