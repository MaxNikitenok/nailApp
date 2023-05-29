import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, SafeAreaView } from 'react-native';
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

      {
        <Text>{currentDate}</Text>
      }

      {!currentDay && (
        <View style={styles.itemContainer}>
          <Text>
            пусто
          </Text>
        </View>
      )}

      {currentDay &&
        currentDay.map((item) => {
          return (
            <View style={styles.itemContainer} key={item._id}>
              <Text>
                {item.time} {item.name}
              </Text>
              <Text>{item.procedures}</Text>
            </View>
          );
        })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 10,
    flex: 1,
  },
});
