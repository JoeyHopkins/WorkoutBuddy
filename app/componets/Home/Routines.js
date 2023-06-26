
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable, TextInput} from 'react-native';

import { Wander } from 'react-native-animated-spinkit'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { showMessage } from "react-native-flash-message";
import * as Colors from '../../config/colors'

import homeSql from '../../controllers/home.controller'
import settingSql from '../../controllers/settings.controller'

const width = Dimensions.get('window').width

export const RoutineChange = (props) => {

  const [routineList, setRoutineList] = useState([]);
  const [newRoutine, setNewRoutine] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect( () => {
    homeSql.getAllRoutines(setRoutineList)
  }, [])

  async function sendRoutineFuntion(submissionType, id = null) {
    setLoading(true)

    let message = ''

    try {

      switch (submissionType) {
        case 'add':
          if(newRoutine === '') 
            {
              showMessage({
                message: 'Error',
                description: 'Please enter a routine',
                type: "danger",
              });
              setLoading(false)
              return
            }
          message = await homeSql.addRoutine(newRoutine)
          setNewRoutine('')
          break;
        case 'delete':
          message = await homeSql.deleteRoutineByID(id)
          break;
        case'moveUp':
          message = await homeSql.moveRoutineUp(id)
          break;
      }

      await homeSql.getAllRoutines(setRoutineList)

      showMessage({
        message: 'Success!',
        description: message,
        type: "success",
      });
    }
    catch (err) {
      showMessage({
        message: 'Error',
        description: err,
        type: "danger",
      });
    }

    setLoading(false)
  }

  const RoutineRecord = ({id, dayNum, routine}) => { 
    return (
      <View style={styles.routineRecordContainer}>
        
        <View style={{flex: 1}}>
          <Text>Day {dayNum + ':  ' + routine}</Text>
        </View>
  
        <View style={styles.iconsContainer}>
          <Pressable onPress={() => { sendRoutineFuntion('moveUp', id) }}>
            <MaterialIcon name='arrow-up' size={20} color={Colors.primary} />
          </Pressable>
  
          <Pressable onPress={() => { sendRoutineFuntion('delete', id) }}>
            <Icon name="trash" size={20} color={Colors.highlight} />
          </Pressable>
        </View>
        
      </View>
    )
  }

  return (
    <>
      <View style={styles.addRoutineContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setNewRoutine}
          value={newRoutine}
          placeholder="New Routine"
        />
        <Pressable
          style={styles.circleButton}
          onPress={() => { sendRoutineFuntion('add') }}
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
    </>
  )
}

export const RoutineMain = (props) => {

  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState(null);
  const [todaysRoutine, setTodaysRoutine] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        let routineID = await getRoutineIDFromSettings('todaysRoutine')
        
        if(routineID != null)
        {
          let returnedRoutine = await homeSql.getRoutineByID(routineID, setRoutine)
          setTodaysRoutine(returnedRoutine)
        }
        else
        {
          let returnedRoutine = await homeSql.getEarliestRoutine()
          setTodaysRoutine(returnedRoutine)
        }

        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const getRoutineIDFromSettings = async (settingName) => {
    try {
  
      let settingValue = await settingSql.getSetting(settingName);

      if (!settingValue) {
        // Setting does not exist, create it with initial value -1
        await settingSql.createNewSetting(settingName, null);
        return null;
      } 
      else
        // Setting exists, retrieve the record that comes back
        return settingValue[0].config;
  
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading == true && (
        <Wander size={48} color={Colors.primary} />
      )}
      {loading == false && todaysRoutine && (
        <Text>{todaysRoutine.routine + ' day'}</Text>
      )}


    </>
  )
}

const styles = StyleSheet.create({
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
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
});