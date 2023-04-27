import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';

type Reception = {
  _id: string;
  date: string;
  time: string;
  name: string;
  procedures: string;
};

export const CalendarMonth: React.FC = ({ navigation }: any) => {
  const [receptions, setReceptions] = useState<{
    [key: string]: Reception[];
  }>();

  useEffect(() => {
    const getData = async () => {
      await axios
        .get('http://192.168.0.111:4999/receptions')
        .then(({ data }) => {
          const reduced = data.reduce(
            (
              acc: { [key: string]: Reception[] },
              currentItem: { [x: string]: any; date: any }
            ) => {
              const { date, ...item } = currentItem;

              if (date in acc) {
                acc[date] = [...acc[date], item];
              } else {
                acc[date] = [item];
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

    getData();
  }, []);

  const renderItem = (item: Reception) => {
    return (
      <View style={styles.itemContainer}>
        <Text>
          {item.time} {item.name}
        </Text>
        <Text>{item.procedures}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Agenda
        firstDay={1}
        items={receptions}
        renderItem={renderItem}
        showOnlySelectedDayItems={true}
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
