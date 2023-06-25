import React, {useRef, useState, useEffect} from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Button, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'

import homeSql from '../../controllers/home.controller'
import { Wander } from 'react-native-animated-spinkit'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const width = Dimensions.get('window').width

export const Home = ({navigation}) => {

  const [routineList, setRoutineList] = useState(null);
  const [newRoutine, setNewRoutine] = useState('');

  useEffect( () => {
    homeSql.getAllRoutines(setRoutineList)
  }, [])

  function submitNewRoutine() {
    homeSql.addRoutine(newRoutine)
    homeSql.getAllRoutines(setRoutineList)
    setNewRoutine('')
  }

  return (
    <>
      <ScrollView style={styles.background}>
         
        <View style={styles.homeContainer}>
          <Text style={styles.homeContainerTitle}>You have no Routines...</Text>

          <Pressable 
            style={styles.button} 
            onPress={() => { console.log('hit') }}
          >
            <Text>Create Routine</Text>
          </Pressable>

        </View>

        <View style={styles.homeContainer}>
          <Text style={styles.homeContainerTitle}>Progress</Text>
        </View>

        <View style={styles.homeContainer}>

          <View style={styles.addRoutineContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setNewRoutine}
              value={newRoutine}
              placeholder="New Routine"
            />
            <Pressable
              style={styles.circleButton}
              onPress={() => { submitNewRoutine() }}
            >
              <MaterialIcon name='check-outline' size={20} color={Colors.black} />
            </Pressable>
          </View>

          {routineList === null ? (
            // Render a loading state while fetching the routine list
            <Wander size={48} color={Colors.primary} />
          ) : routineList.length > 0 ? (
            <Text>Render the Reports screen here</Text>
          ) : (
            <Text>You have no Routines...</Text>
          )}

        </View>

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 20,
    padding: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    borderColor: Colors.primary
  },
  homeContainerTitle: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  background: {
    backgroundColor: Colors.background,
  },
  button: {
    width: 150,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  input: {
    height: 40,
    width: width - 150,
    marginRight: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addRoutineContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginBottom: 30,
    // marginVertical: 10,
  }
});