import React, {useRef, useState, useEffect} from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Button, Pressable, TextInput, FlatListn, SectionList} from 'react-native';
import * as Colors from '../../config/colors'

import homeSql from '../../controllers/home.controller'
import { Wander } from 'react-native-animated-spinkit'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';

const width = Dimensions.get('window').width

export const Home = ({navigation}) => {

  const [routineList, setRoutineList] = useState([]);
  const [newRoutine, setNewRoutine] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    homeSql.getAllRoutines(setRoutineList, setLoading)
  }, [])

  function submitNewRoutine() {
    setLoading(true)
    homeSql.addRoutine(newRoutine)
    homeSql.getAllRoutines(setRoutineList, setLoading)
    setNewRoutine('')
  }

  function deleteRoutine(id) {
    setLoading(true)
    homeSql.deleteRoutineByID(id)
    homeSql.getAllRoutines(setRoutineList, setLoading)
  }

  const RoutineRecord = ({id, dayNum, routine}) => { 
    return (
      <View style={styles.routineRecordContainer}>
        
        <View style={{flex: 1}}>
          <Text>Day {dayNum + ':  ' + routine}</Text>
        </View>

        <View style={styles.iconsContainer}>
          <Pressable onPress={() => { console.log('hit') }}>
            <MaterialIcon name='arrow-up' size={20} color={Colors.primary} />
          </Pressable>

          <Pressable onPress={() => { deleteRoutine(id) }}>
            <Icon name="trash" size={20} color={Colors.highlight} />
          </Pressable>
        </View>
        
      </View>
    )
  }

  return (
    <>
      <ScrollView style={styles.background}>
         
        <View style={styles.homeContainer}>
          <Text style={styles.homeContainerTitle}>You have no Routines...</Text>

          <Pressable 
            style={styles.button} 
            onPress={() => { console.log('hit') }}c
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

          {loading == true && (
            <Wander size={48} color={Colors.primary} />
          )}

          {routineList && routineList.length > 0 && loading == false && (
            <>
              {routineList.map((routine, index) => (
                <RoutineRecord key={index} id={routine.id} dayNum={routine.dayNum} routine={routine.routine} />
              ))}
            </>
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
    paddingVertical: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    borderColor: Colors.primary,
    overflow: 'hidden',
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
  },
  routineContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  routineRecordContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 1,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
});