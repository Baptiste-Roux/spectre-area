import EditScreenInfo from '../components/EditScreenInfo';
import { FlatList, TouchableWithoutFeedback } from 'react-native';
import { View, StyleSheet, Text, TouchableOpacity, Alert, TextInput, Modal, Pressable } from "react-native";
import MyPicker from '../MyPicker'
import { actions, reactions } from '../Data.json';
import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
const BLUE = '#102d66';
const ORANGE = '#ffa600';
const WHITE = '#ffffff';


export default function TabTwoScreen() {
  const rtoken = async () => {
    const token = await AsyncStorage.getItem("jwt");
    return (token);
  }
  const rserv = async () => {
    const token = await AsyncStorage.getItem("ip");
    return (token);
  }
  let token = ''
  let servip = ''
  AsyncStorage.getItem("ip").then(test => {servip = JSON.parse(test)});
  AsyncStorage.getItem("jwt").then(test => {token = JSON.parse(test)});


  const [serviceModal, setServiceModal] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [reactioModal, setReactioModal] = useState(false);
  const [sereactModal, setSereactModal ] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [service, setService] = useState('');
  const [action, setAction] = useState('Meteo');
  const [reactio, setReactio] = useState('Slack');
  const [sereact, setSereact] = useState('');

  const actions_name = Object.keys(actions);
  const service_name = Object.keys(actions[action].actions);
  const reactio_name = Object.keys(actions[action].reaction);
  const sereact_name = Object.keys(reactions[reactio].reactions);

  const [value_action] = useState('');
  const [value_reaction] = useState('');
  const [inputs_acti, setInputsaction ] = useState({});
  const [inputs_react, setInputsreaction ] = useState({});


  postArea=()=> {
    let obj = {
      action_name: action + service,
      reaction_name: reactio + sereact,
      action_params: inputs_acti,
      reaction_params: inputs_react
    }
    // console.log(obj);
    console.log("token")
    console.log(token)
    console.log(servip)
    const zinzi = JSON.stringify(obj);
    url = "http://" + servip + ":8080/api/v1/area"
    console.log('Bearer ' + token)
    var config = {
      method: 'post',
      url: url,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data : zinzi
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  setInputAction=(input_type, value) => {
    const inputs_action = inputs_acti
    inputs_action[input_type] = value
    setInputsaction(inputs_action)
  }

  setInputReaction=(input_type, value) => {
    const inputs_reaction = inputs_react
    inputs_reaction[input_type] = value
    setInputsreaction(inputs_reaction)
  }
  return (
    <View style={styles.container}>
      <View style={{ paddingVertical: 20 }} />
      <Text style={styles.titleStyle}>{action}</Text>
      <View style={{ paddingVertical: 5 }} />
      <TouchableOpacity style={styles.button} onPress={() =>setActionModal(!actionModal)} >
        <Text style={styles.buttonText}>Actions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() =>setServiceModal(!serviceModal)}  >
        <Text style={styles.buttonText}>Services</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() =>setReactioModal(!reactioModal)}  >
        <Text style={styles.buttonText}>Reactions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() =>setSereactModal(!sereactModal)}  >
        <Text style={styles.buttonText}>ReactServ</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style={{color: ORANGE}}>Input Action</Text>
          <View style={{ paddingVertical: 5 }} />

          {actions[action].inputs.map((input) => {
              return (
                  <TextInput  style={{ height: 65, width: 260 , borderWidth: 1, backgroundColor: ORANGE, borderRadius: 15, color: WHITE }}
                  onChangeText={(text) => this.setInputAction(input, text)}
                  value_action={value_action}
                  placeholder={input}
                  key="{input}"
                  />
                  )}
               )}

          <Text style={{color: ORANGE}}>Input Reaction</Text>
          <View style={{ paddingVertical: 5 }} />

          {reactions[reactio].inputs.map((input) => {
              return (
                  <TextInput  style={{ height: 65, width: 260 , borderWidth: 1, backgroundColor: ORANGE, borderRadius: 15, color: WHITE }}
                  onChangeText={(text) => this.setInputReaction(input, text)}
                  value_reaction={value_reaction}
                  placeholder={input}
                  id={input}
                  />
                  )}
               )}

         <View style={{ paddingVertical: 5 }} />
            <Pressable
              style={[styles.button]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Input</Text>
      </Pressable>

      <View style={{ paddingVertical: 10 }} />

      <TouchableOpacity onPress={() => postArea()} style={styles.button}>
         <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <MyPicker setModalOpen={setActionModal} modalOpen={actionModal} value={action} setValue={(v) => {setAction(v); setService(Object.keys(actions[v].actions)[0])}} items={actions_name} />
      <MyPicker setModalOpen={setServiceModal} modalOpen={serviceModal} value={service} setValue={setService} items={service_name} />
      <MyPicker setModalOpen={setReactioModal} modalOpen={reactioModal} value={reactio} setValue={(v) => {setReactio(v); setSereact(Object.keys(reactions[v].reactions)[0])}} items={reactio_name} />
      <MyPicker setModalOpen={setSereactModal} modalOpen={sereactModal} value={sereact} setValue={setSereact} items={sereact_name} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: ORANGE,
    width: '70%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: WHITE,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: WHITE,
  },
  titleStyle: {
    fontSize: 22,
    marginTop: -20,
    color: WHITE,
  },
  buttonInput: {
    width: '70%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: WHITE,
    elevation: 5,
    marginBottom: 10,
  }
});
