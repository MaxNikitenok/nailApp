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
  key: string;
  color: string;
}

type Dots = {
  dots: Dot;
}

export const Calendar2: React.FC = ({ navigation }: any) => {
  const [receptions, setReceptions] = useState<{
    [key: string]: Reception[];
  }>();
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: Dot[];
  }>()

  useEffect(() => {
    const getData = async () => {
      await axios
        .get('http://192.168.0.111:4999/receptions')
        .then(({ data }) => {
          const reduced = data.reduce(
            (
              acc: { [key: string]: Dots },
              currentItem: { [x: string]: any; date: any }
            ) => {
              const { date, ...item } = currentItem;

              if (date in acc) {
                acc[date] = {dots: [...acc[date].dots, {key: item._id, color: 'green'} as Dot]};
              } else {
                acc[date] = {dots: [{key: item._id, color: 'green'} as Dot]};
              }

              return acc;
            },
            {}
          );

          
          setMarkedDates(reduced);
          // reduced.map((item: any) => {
          //   console.log(item)
          // })

          
          console.log(markedDates)
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
        initialDate={moment().format('YYYY-MM-DD')}
        markingType={'multi-dot'}
        markedDates={markedDates}
      />
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
