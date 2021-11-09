import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";

const WHITE = '#ffffff';

const MyPicker = ({modalOpen, setModalOpen, value, setValue, items}) => {

    const pickerData = (data) => {
        return (data?.length > 0) && (
            data.map((val, index) => <Picker.Item label={val} value={val} key={index}/> )
        )
    };
    return (
        <Modal animationType="slide" transparent={true} visible={modalOpen} >
        <View style={styles.container}>
          <View style={styles.pickerContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalOpen(!modalOpen)} >
              <Text>Close</Text>
            </TouchableOpacity>
            <Picker selectedValue={value} style={{height: 50, width: '100%'}} onValueChange={(itemValue, itemIndex) => setValue(itemValue)}>
                {pickerData(items)}
            </Picker>
          </View>
        </View>
      </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pickerContainer: {
        backgroundColor: WHITE, 
        width: '100%', 
        height: '40%', 
        position: 'absolute', 
        bottom: 0,
    },
    closeButton: {
        justifyContent: 'center', 
        alignItems: 'center',
    },
})

export default MyPicker;