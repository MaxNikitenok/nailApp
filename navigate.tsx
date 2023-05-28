import React from 'react';
import { Main } from './Main';
import { Calendar } from './Calendar';
import { Calendar2 } from './Calendar2';
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
          name="Calendar2"
          component={Calendar2}
          options={{ title: 'Календарь2' }}
        />
        <Stack.Screen
          name="AddReception"
          component={AddReception}
          options={{ title: 'Добавление записи' }}
        />
        {/* <Stack.Screen
          name="Calendar2"
          component={CalendarMonth}
          options={{ title: 'Календарь 2' }}
        /> */}
        <Stack.Screen name="Day" component={Day} options={{ title: 'День' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
