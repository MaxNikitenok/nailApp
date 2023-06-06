import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Pressable,
  Button,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import axios from 'axios';
import moment from 'moment';
import { TextInput } from 'react-native';
import { Select } from './components/Select';

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
  dayNames: [
    'воскресенье',
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
  ],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня',
};
LocaleConfig.defaultLocale = 'ru';

type Reception = {
  _id: string;
  time: string;
  name: string;
  procedures: string;
};

type Dot = {
  concat: any;
  key: string;
  color: string;
};

type Dots = {
  dots: Dot;
};

const slots = [
  { time: '09:00' },
  { time: '11:30' },
  { time: '14:00' },
  { time: '17:00' },
];

export const Calendar2: React.FC = ({ navigation }: any) => {
  const [receptions, setReceptions] = useState<{
    [key: string]: Reception[];
  }>();
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: { dots: Dot[] };
  }>();

  const [currentDay, setCurrentDay] = useState([] as Reception[]);

  const [currentDate, setCurrentDate] = useState('');

  const getData = async () => {
    await axios
      .get('http://192.168.0.111:4999/receptions')
      .then(({ data }) => {
        const reducedMarkedDates = data.reduce(
          (
            acc: { [key: string]: Dots },
            currentItem: { [x: string]: any; date: string }
          ) => {
            const { date, ...item } = currentItem;

            if (date in acc) {
              acc[date] = {
                dots: acc[date].dots.concat({
                  key: item._id,
                  color: 'green',
                } as Dot),
              } as unknown as Dots;
            } else {
              acc[date] = {
                dots: [{ key: item._id, color: 'green' } as Dot],
              } as unknown as Dots;
            }

            return acc;
          },
          {}
        );

        setMarkedDates(reducedMarkedDates);

        const reduced = data.reduce(
          (
            acc: { [key: string]: Reception[] },
            currentItem: { [x: string]: any; date: any }
          ) => {
            const { date, ...item } = currentItem;

            if (date in acc) {
              acc[date] = [...acc[date], item as Reception];
            } else {
              acc[date] = [item as Reception];
            }

            return acc;
          },
          {}
        );

        setReceptions(reduced);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert('Ошибка', 'Ошибка получения');
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [clientName, onChangeClientName] = useState('');
  const [selected, setSelected] = useState([] as string[]);
  const [newReceptionTime, setNewReceptionTime] = useState('');

  const addReception = async () => {
    if (!clientName) {
      Alert.alert('Введите имя клиента');
      return;
    }
    try {
      await axios
        .post(
          'http://192.168.0.111:4999/receptions/',
          JSON.stringify({
            date: currentDate,
            time: newReceptionTime,
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
          setCurrentDay(currentDay ? [...currentDay, response.data] : [response.data]);
          getData();
          Alert.alert(
            `${response.data.name} записана на ${response.data.procedures} ${response.data.date} в ${response.data.time}`
          );
        });
    } catch (e) {
      console.log(e);
    }
  };
  const deleteReception = async (id: string) => {
    await axios
      .delete(`http://192.168.0.111:4999/receptions/${id}`)
      .then((response) => {
        setCurrentDay(
          currentDay.filter((reception) => reception._id !== response.data._id)
        );
        getData();
      });
  };

  const onDayPressHandler = (e: any) => {
    setCurrentDate(e.dateString);
    receptions && setCurrentDay(receptions[e.dateString]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeClientName}
              value={clientName}
              placeholder="Введите имя клиента"
            />
            <View style={styles.selectItem}>
              <Select selected={selected} setSelected={setSelected} />
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
            <View style={styles.buttonContainer}>
              <Button
                title="Добавить запись"
                onPress={addReception}
                disabled={!clientName || selected.length < 1}
                color={'#d10050'}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Calendar
        firstDay={1}
        initialDate={moment().format('YYYY-MM-DD')}
        markingType={'multi-dot'}
        markedDates={markedDates}
        onDayPress={onDayPressHandler}
        onDayLongPress={(e) => {
          Alert.alert(e.dateString);
        }}
      />

      {<Text style={styles.dateHeader}>{currentDate}</Text>}

      {currentDay &&
        slots.map((item) => {
          const receptionInTime = currentDay.find(
            (reception) => reception.time === item.time
          );
          if (receptionInTime) {
            return (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => Alert.alert(item.time)}
                onLongPress={() => deleteReception(receptionInTime._id)}
                key={receptionInTime._id}
              >
                <Text style={styles.time}>{item.time}</Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{receptionInTime.name}</Text>
                  <Text style={styles.procedures}>
                    {receptionInTime.procedures}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                setModalVisible(!modalVisible);
                setNewReceptionTime(item.time);
              }}
              onLongPress={() => Alert.alert(item.time)}
              key={item.time}
            >
              <Text style={styles.time}>{item.time}</Text>
              <View style={styles.addContainer}>
                <Text style={styles.add}>Добавить</Text>
              </View>
            </TouchableOpacity>
          );
        })}

      {!currentDay &&
        slots.map((item) => {
          return (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                setModalVisible(!modalVisible);
                setNewReceptionTime(item.time);
              }}
              onLongPress={() =>
                console.log({ ...markedDates, '2023-06-09': { dots: [] } })
              }
              key={item.time}
            >
              <Text style={styles.time}>{item.time}</Text>
              <View style={styles.addContainer}>
                <Text style={styles.add}>Добавить</Text>
              </View>
            </TouchableOpacity>
          );
        })}

      {currentDay &&
        currentDay.map((item) => {
          if (slots.every((slot) => slot.time !== item.time))
            return (
              <TouchableOpacity
                style={styles.extraItemContainer}
                onPress={() => Alert.alert(item.time)}
                onLongPress={() => deleteReception(item._id)}
                key={item._id}
              >
                <Text style={styles.time}>{item.time}</Text>
                <View style={styles.infoContainer}>
                  <Text>доп. запись</Text>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.procedures}>{item.procedures}</Text>
                </View>
              </TouchableOpacity>
            );
        })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  dateHeader: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
    fontSize: 20,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 15,
    padding: 5,
    flex: 1,
  },
  extraItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ff337750',
    margin: 5,
    borderRadius: 15,
    padding: 5,
    flex: 1,
  },
  addContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  add: {},
  time: {
    paddingLeft: 5,
    paddingRight: 10,
    fontSize: 18,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#999',
  },
  infoContainer: {
    paddingLeft: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: '900',
  },
  procedures: {},

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  input: {
    borderWidth: 0,
    paddingLeft: 5,
    fontSize: 18,
  },
  selectItem: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    gap: 5,
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: 'center',
  },
});
