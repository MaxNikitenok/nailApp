import React, { useState } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Alert,
  ImageBackground,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Select } from './components/Select';

export const AddReception = ({ navigation }: any) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [receptionDate, setReceptionDate] = useState('');
  const [clientName, onChangeClientName] = useState('');
  const [selected, setSelected] = useState([] as string[]);

  let ye = '';
  let mo = '';
  let da = '';
  let ho = '';
  let mi = '';

  if (receptionDate) {
    let d = new Date(receptionDate.toString());
    ye = new Intl.DateTimeFormat('ru', { year: 'numeric' }).format(d);
    mo = new Intl.DateTimeFormat('ru', { month: 'long' }).format(d);
    da = new Intl.DateTimeFormat('ru', { day: 'numeric' }).format(d);
    ho = new Intl.DateTimeFormat('ru', { hour: 'numeric' }).format(d) + ':';
    mi = new Intl.DateTimeFormat('ru', { minute: 'numeric' }).format(d);
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setReceptionDate(date);

    hideDatePicker();
  };

  const addReception = async () => {
    if (!receptionDate) {
      Alert.alert('Введите дату и время');
      return;
    }
    if (!clientName) {
      Alert.alert('Введите имя клиента');
      return;
    }
    try {
      await axios
        .post(
          'http://192.168.0.111:4999/receptions/',
          JSON.stringify({
            date: `${ye} ${mo} ${da}`,
            time: `${ho}${mi}`,
            name: clientName,
            procedures: selected.join(', '),
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          Alert.alert(
            `${response.data.name} записана на ${response.data.procedures} ${response.data.date} в ${response.data.time}`
          );
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewBlock}>
        <View style={styles.item}>
          <Text style={styles.text}>Имя:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeClientName}
            value={clientName}
            placeholder="Введите имя клиента"
          />
        </View>

        <View style={styles.item}>
          <Text style={styles.text}>Дата:</Text>
          <Text onPress={showDatePicker}>
            {receptionDate ? (
              <Text style={styles.text}>{`${da} ${mo} ${ye}`}</Text>
            ) : (
              <Text style={styles.pickDateTame}>Выбрать дату и время</Text>
            )}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.text}>Время:</Text>
          <Text onPress={showDatePicker}>
            {receptionDate ? (
              <Text style={styles.text}>{`${ho}${mi}`}</Text>
            ) : (
              <Text style={styles.pickDateTame}>Выбрать дату и время</Text>
            )}
          </Text>
        </View>

        <View style={styles.selectItem}>
          <Select selected={selected} setSelected={setSelected} />
        </View>
      </View>

      <View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          is24Hour={true}
        />
      </View>
        <ImageBackground
          source={require('./assets/background_1.png')}
          resizeMode="cover"
          style={styles.image}
        >
      <View style={styles.buttonContainer}>
        <Button
          title="Добавить запись"
          onPress={addReception}
          disabled={!receptionDate || !clientName || selected.length < 1}
          color={'#d10050'}
        />
      </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  input: {
    borderWidth: 0,
    paddingLeft: 5,
    fontSize: 18,
  },
  previewBlock: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 8,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectItem: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    gap: 5,
  },
  text: {
    fontSize: 18,
    marginRight: 5,
  },
  pickDateTame: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
    paddingTop: 3,
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: 'center',
  },
});
