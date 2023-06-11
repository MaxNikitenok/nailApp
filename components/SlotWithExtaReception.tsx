import React from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';

export const SlotWithExtraReception = (props: {
  item: {
    time:
      string;
    _id: string
    name:
      string
    procedures:
      string
  };
  deleteReception: (arg0: any) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.extraItemContainer}
      onPress={() => Alert.alert(props.item.time)}
      onLongPress={() => props.deleteReception(props.item._id)}
      
    >
      <Text style={styles.time}>{props.item.time}</Text>
      <View style={styles.infoContainer}>
        <Text>доп. запись</Text>
        <Text style={styles.name}>{props.item.name}</Text>
        <Text style={styles.procedures}>{props.item.procedures}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  extraItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ff337750',
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
