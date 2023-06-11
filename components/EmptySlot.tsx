import React from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';

export const EmptySlot = (props: {
  setModalVisible: (arg0: boolean) => void;
  modalVisible: boolean;
  setNewReceptionTime: (arg0: string) => void;
  item: {
    time: string;
  };
}) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        props.setModalVisible(!props.modalVisible);
        props.setNewReceptionTime(props.item.time);
      }}
      onLongPress={() => Alert.alert(props.item.time)}
    >
      <Text style={styles.time}>{props.item.time}</Text>
      <View style={styles.addContainer}>
        <Text style={styles.add}>Добавить</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  add: {},
  time: {
    paddingLeft: 5,
    paddingRight: 10,
    fontSize: 18,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#999',
  },
});
