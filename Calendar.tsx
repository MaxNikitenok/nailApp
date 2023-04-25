import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert, FlatList, Image } from 'react-native';

export const Calendar = ({ navigation }: any) => {
  const [receptions, setReceptions] = useState();

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

  return (
    <View>
      <View>
        <FlatList
          data={receptions}
          renderItem={({ item }) => (
            <View key={item._id}>
              <Text>{item.name}</Text>
              <Text>{item.dateTime}</Text>
              <Text>{item.procedures}</Text>
              <Image source={{uri: `http://192.168.0.111:4999/${item.picture}`}} style={styles.image} />
            </View>
          )}
        />
      </View>
      <Button title="На главную" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  }
});
