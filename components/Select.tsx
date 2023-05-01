import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MultiSelect } from 'react-native-element-dropdown';

export const Select = ({selected, setSelected}: any) => {

  const DATA = [
    { label: 'Маникюр', value: 'Маникюр' },
    { label: 'Педикюр', value: 'Педикюр' },
    { label: 'Коррекция', value: 'Коррекция' },
    { label: 'Дизайн', value: 'Дизайн' },
  ];

  const renderDataItem = (item: { label: string }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        {selected.includes(item.label) ? (
          <AntDesign
            style={styles.icon}
            color="green"
            name="checkcircleo"
            size={20}
          />
        ) : (
          <AntDesign
            style={styles.icon}
            color="black"
            name="minuscircleo"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={DATA}
          labelField="label"
          valueField="value"
          placeholder="Выбрать процедуры"
          value={selected}
          search
          searchPlaceholder="Поиск..."
          onChange={(item) => {
            setSelected(item);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="filetext1"
              size={20}
            />
          )}
          renderItem={renderDataItem}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
              <View style={styles.selectedStyle}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                <AntDesign color="red" name="delete" size={17} />
              </View>
            </TouchableOpacity>
          )}
        />
        <StatusBar />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
