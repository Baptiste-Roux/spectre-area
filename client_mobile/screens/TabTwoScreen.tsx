import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useState } from 'react';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { FlatList, TouchableWithoutFeedback } from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012929',
  },
  item: {
    width: '100%',
    marginTop: 5,
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'grey',
    color: "black",
    fontSize: 10,
  },
});

export default function TabTwoScreen() {
  const [people, setPeople] = useState([
    { name: 'shaun', id: '1' },
    { name: 'yoshi', id: '2' },
    { name: 'mario', id: '3' },
    { name: 'luigi', id: '4' },
    { name: 'peach', id: '5' },
    { name: 'toad', id: '6' },
    { name: 'bret', id: '7' },
    { name: 'la', id: '8' },
    { name: 'grosse', id: '9' },
    { name: 'pute', id: '10' },
    { name: 'qui', id: '11' },
    { name: 'suce', id: '12' },
    { name: 'mon', id: '13' },
    { name: 'chibre', id: '14' },
    { name: 'ok?', id: '15' },

  ]);

  return (

    <View style={styles.container}>
      <FlatList 
        numColumns={2}
        keyExtractor={(item) => item.id} 
        data={people} 
        renderItem={({ item }) => ( 
          <Text style={styles.item}>{item.name}{'\ntest'}</Text>
        )}
      />
    </View>
  );
}
