import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import axios from 'axios';
import moment from 'moment';

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
  date: string;
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
  {time: '09:00'},
  {time: '11:30'},
  {time: '14:00'},
  {time: '17:00'},
]

export const Calendar2: React.FC = ({ navigation }: any) => {
  const [receptions, setReceptions] = useState<{
    [key: string]: Reception[];
  }>();
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: { dots: Dot[] };
  }>();

  const [currentDay, setCurrentDay] = useState([] as Reception[]);

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
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

          console.log(markedDates);

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

          console.log(receptions);
        })
        .catch((err) => {
          console.log(err);
          Alert.alert('Ошибка', 'Ошибка получения');
        });
    };

    getData();
  }, []);

  // const renderItem = (item: Reception) => {
  //   return (
  //     <View style={styles.itemContainer}>
  //       <Text>
  //         {item.time} {item.name}
  //       </Text>
  //       <Text>{item.procedures}</Text>
  //     </View>
  //   );
  // };

  const manicure = { key: 'manicure', color: 'green' };

  return (
    <SafeAreaView style={styles.safe}>
      <Calendar
        firstDay={1}
        initialDate={moment().format('YYYY-MM-DD')}
        markingType={'multi-dot'}
        markedDates={markedDates}
        onDayPress={(e) => {
          setCurrentDay(receptions ? receptions[e.dateString] : []);
          setCurrentDate(e.dateString);
        }}
        onDayLongPress={(e) => {
          console.log(e.dateString);
        }}
      />

      {<Text style={styles.dateHeader}>{currentDate}</Text>}

      {!currentDay && (
        slots.map((item)=>{
          return (
            <TouchableOpacity style={styles.itemContainer} onPress={()=>Alert.alert('press')} onLongPress={()=>Alert.alert('long press')} key={item.time}>
              <Text style={styles.time}>{item.time}</Text>
              <View style={styles.addContainer}>
                <Text style={styles.add}>Добавить</Text>
              </View>
            </TouchableOpacity>
          )
        })
      )}

      {currentDay &&
        currentDay.map((item) => {
          return (
            <TouchableOpacity style={styles.itemContainer} onPress={()=>Alert.alert('press')} onLongPress={()=>Alert.alert('long press')} key={item._id}>
              <Text style={styles.time}>{item.time}</Text>
              <View style={styles.infoContainer}>
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
  addContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  add: {

  },
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
    fontWeight: '900'
  },
  procedures: {

  },
});
