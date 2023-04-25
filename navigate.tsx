import React from 'react';
import { Main } from './Main';
import { Calendar } from './Calendar';
import { Day } from './Day';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AddReception } from './AddReception';

const Stack = createStackNavigator();

export default function Navigate() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Main}
          options={{ title: 'Главная' }}
        />
        <Stack.Screen
          name="Calendar"
          component={Calendar}
          options={{ title: 'Календарь' }}
        />
        <Stack.Screen
          name="AddReception"
          component={AddReception}
          options={{ title: 'Добавление записи' }}
        />
        <Stack.Screen name="Day" component={Day} options={{ title: 'День' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
