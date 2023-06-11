import React from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';

export const SlotWithReception = (props: {
  item: {
    time: string;
  };
  deleteReception: (arg0: string) => void;
  receptionInTime: {
    _id: string;
    name: string;
    procedures: string;
  };
}) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => Alert.alert(props.item.time)}
      onLongPress={() => props.deleteReception(props.receptionInTime._id)}
    >
      <Text style={styles.time}>{props.item.time}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{props.receptionInTime.name}</Text>
        <Text style={styles.procedures}>
          {props.receptionInTime.procedures}
        </Text>
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
  infoContainer: {
    paddingLeft: 5,
  },
  time: {
    paddingLeft: 5,
    paddingRight: 10,
    fontSize: 18,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#999',
  },
  name: {
    fontSize: 16,
    fontWeight: '900',
  },
  procedures: {},
});
