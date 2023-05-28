import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const Main = ({ navigation }: any) => {
  const loadScene = () => {
    navigation.navigate('Calendar');
  };

  return (
    <View style={styles.main}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Calendar')}
        style={styles.appButtonContainer}
      >
        <Text style={styles.appButtonText}>Календарь</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Calendar2')}
        style={styles.appButtonContainer}
      >
        <Text style={styles.appButtonText}>Календарь2</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddReception')}
        style={styles.appButtonContainer}
      >
        <Text style={styles.appButtonText}>Добавить запись</Text>
      </TouchableOpacity>

          </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    gap: 10,
    padding: 20,
    alignItems: 'center',
  },
  appButtonContainer: {
    width: 250,
    elevation: 8,
    backgroundColor: '#9421d1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
