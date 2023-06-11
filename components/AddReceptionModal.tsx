import {
  Alert,
  GestureResponderEvent,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Button, Modal, Pressable, Text, View } from 'react-native';
import { Select } from './Select';

export const AddReceptionModal = (props: {
  modalVisible: boolean | undefined;
  setModalVisible: (arg0: boolean) => void;
  onChangeClientName: ((text: string) => void) | undefined;
  clientName: string | undefined;
  selected: string | any[];
  setSelected: any;
  addReception: ((event: GestureResponderEvent) => void) | undefined;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        props.setModalVisible(!props.modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            onChangeText={props.onChangeClientName}
            value={props.clientName}
            placeholder="Введите имя клиента"
          />
          <View style={styles.selectItem}>
            <Select selected={props.selected} setSelected={props.setSelected} />
          </View>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => props.setModalVisible(!props.modalVisible)}
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
          <View style={styles.buttonContainer}>
            <Button
              title="Добавить запись"
              onPress={props.addReception}
              disabled={!props.clientName || props.selected.length < 1}
              color={'#d10050'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 0,
    paddingLeft: 5,
    fontSize: 18,
  },
  selectItem: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    gap: 5,
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: 'center',
  },
});
