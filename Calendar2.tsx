import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import axios from 'axios';
import moment from 'moment';
import { AddReceptionModal } from './components/AddReceptionModal';
import { EmptySlot } from './components/EmptySlot';
import { SlotWithReception } from './components/slotWithReception';
import { SlotWithExtraReception } from './components/SlotWithExtaReception';

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
          setCurrentDay(
            currentDay ? [...currentDay, response.data] : [response.data]
          );
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
      <AddReceptionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        clientName={clientName}
        onChangeClientName={onChangeClientName}
        selected={selected}
        setSelected={setSelected}
        addReception={addReception}
      />
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
        currentDate &&
        slots.map((item) => {
          const receptionInTime = currentDay.find(
            (reception) => reception.time === item.time
          );
          if (receptionInTime) {
            return (
              <SlotWithReception
                item={item}
                receptionInTime={receptionInTime}
                deleteReception={deleteReception}
                key={receptionInTime._id}
              />
            );
          }
          return (
            <EmptySlot
              item={item}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              setNewReceptionTime={setNewReceptionTime}
              key={item.time}
            />
          );
        })}

      {!currentDay &&
        slots.map((item) => {
          return (
            <EmptySlot
              item={item}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              setNewReceptionTime={setNewReceptionTime}
              key={item.time}
            />
          );
        })}

      {currentDay &&
        currentDay.map((item) => {
          if (slots.every((slot) => slot.time !== item.time))
            return (
              <SlotWithExtraReception
                item={item}
                deleteReception={deleteReception}
                key={item._id}
              />
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
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
});
