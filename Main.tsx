import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const Main = ({ navigation }: any) => {
  const loadScene = () => {
    navigation.navigate('Calendar');
  }

  return (
    <View style={styles.main}>
      <Text style={styles.menuItem} onPress={()=>navigation.navigate('Calendar')}>Календарь</Text>
      <Text style={styles.menuItem} onPress={()=>navigation.navigate('AddReception')}>Добавить запись</Text>
      <Text style={styles.menuItem} onPress={()=>navigation.navigate('Calendar2')}>Календарь 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  menuItem: {
    padding: 10,
    fontSize: 30,
  },
});
