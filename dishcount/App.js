import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import MapScreen from "./MapScreen";
import * as FileSystem from 'expo-file-system';

const Stack = createNativeStackNavigator();

export default function App() {
  const [discountData, setDiscountData] = useState([]);

  useEffect(() => {
    loadDiscountData();
  }, []);

  const loadDiscountData = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'student_discounts.csv';
      // First, copy the asset to the document directory
      await FileSystem.downloadAsync(
        require('./assets/student_discounts.csv'),
        fileUri
      );
      // Read the file
      const csvText = await FileSystem.readAsStringAsync(fileUri);
      const rows = csvText.split('\n');
      const parsedData = rows.map(row => {
        const [company, discount, category] = row.split(',');
        return { company: company.trim(), discount: discount.trim(), category: category.trim() };
      });
      setDiscountData(parsedData);
    } catch (error) {
      console.error('Error loading discount data:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
          initialParams={{ discountData }}
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
