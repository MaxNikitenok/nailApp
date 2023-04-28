import React, { useState } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Alert,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MultiSelect } from 'react-native-element-dropdown';

export const AddReception = ({ navigation }: any) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [receptionDate, setReceptionDate] = useState('');
  const [clientName, onChangeClientName] = useState('');
  const [selected, setSelected] = useState([] as string[]);

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
            date: new Date(receptionDate).toJSON().slice(0, 10),
            time: receptionDate.toString().slice(-17, -12),
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

  const DATA = [
    { label: 'Маникюр', value: 'Маникюр' },
    { label: 'Педикюр', value: 'Педикюр' },
    { label: 'Коррекция', value: 'Коррекция' },
  ];

  const renderDataItem = (item: { label: string }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        {selected.includes(item.label) ? (
          <AntDesign
            style={styles.icon}
            color="green"
            name="checkcircleo"
            size={20}
          />
        ) : (
          <AntDesign
            style={styles.icon}
            color="black"
            name="minuscircleo"
            size={20}
          />
        )}
      </View>
    );
  };

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
    ho = new Intl.DateTimeFormat('ru', { hour: 'numeric' }).format(d);
    mi = new Intl.DateTimeFormat('ru', { minute: 'numeric' }).format(d);
  }

  return (
    <>
      <View>
        <Text>Имя: {clientName}</Text>
        <Text>Дата: {`${da} ${mo} ${ye}`}</Text>
        <Text>Время: {`${ho}:${mi}`}</Text>
        <Text>Процедуры: {selected}</Text>
      </View>
      <View style={styles.addDateWrapper}>
        <View>
          <Button title="Выбрать дату" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            is24Hour={true}
          />
        </View>

        <View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeClientName}
            value={clientName}
            placeholder="Имя клиента"
          />
        </View>

        <View style={styles.container}>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={DATA}
            labelField="label"
            valueField="value"
            placeholder="Выбрать процедур"
            value={selected}
            search
            searchPlaceholder="Поиск..."
            onChange={(item) => {
              setSelected(item);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color="black"
                name="filetext1"
                size={20}
              />
            )}
            renderItem={renderDataItem}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                <View style={styles.selectedStyle}>
                  <Text style={styles.textSelectedStyle}>{item.label}</Text>
                  <AntDesign color="red" name="delete" size={17} />
                </View>
              </TouchableOpacity>
            )}
          />
          <StatusBar />
        </View>

        <Button title="Добавить запись" onPress={addReception} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  addDateWrapper: {
    flex: 1,
    justifyContent: 'space-around',
  },
  input: {
    borderWidth: 0,
    padding: 5,
    marginLeft: 40,
    marginRight: 40,
    fontSize: 16,
  },

  container: {
    backgroundColor: '#37d5d212',
    paddingTop: 30,
    flex: 1,
    padding: 5,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
