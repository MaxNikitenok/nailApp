import axios from 'axios';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import moment from 'moment';

type IReception = {
  _id: string;
  dateTime: string;
  name: string;
  procedures: [string];
};

export const Calendar = ({ navigation }: any) => {
  const [receptions, setReceptions] = useState([] as unknown as [IReception]);

  React.useEffect(() => {
    axios
      .get('http://192.168.0.111:4999/receptions')
      .then(({ data }) => {
        setReceptions(data);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert('Ошибка', 'Ошибка получения');
      });
  }, []);

  const startDay = moment().startOf('month');
  const endDay = moment().endOf('month');

  const calendar = [];
  const day = startDay.clone();

  while (!day.isAfter(endDay)) {
    calendar.push(day.clone());
    day.add(1, 'day');
  }

  return (
    <View>
      <FlatList
        data={calendar}
        renderItem={({ item }) => (
          <View key={item.format('D')}>
            <Text>{item.format('D')}</Text>
            <FlatList
              data={receptions}
              renderItem={({ item }) => (
                <View key={item._id}>
                  <Text>{item.name}</Text>
                  <Text>{item.date.slice(0, 10)}</Text>
                  <Text>{item.time}</Text>
                  <Text>{item.procedures}</Text>
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});
