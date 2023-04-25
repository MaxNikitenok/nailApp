import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import MainStack from './navigate';

export default function App() {
  const pressHandler = () => {
    Alert.alert('Молодец', 'Как дела?', [
      { text: 'Ок', onPress: () => Alert.alert('Cупер') },
      { text: 'Так себе', onPress: () => Alert.alert('Лошара') },
    ]);
  };

  return <MainStack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
  },
});
