
import React, {useState, useEffect, useRef} from 'react';
import { View, Text, Dimensions, Pressable, TextInput} from 'react-native';

import { Wander } from 'react-native-animated-spinkit'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { showMessage } from "react-native-flash-message";
import * as Colors from '../../config/colors'

import homeSql from '../../controllers/home.controller'
import settingSql from '../../controllers/settings.controller'
import styles from '../../config/styles'

const width = Dimensions.get('window').width

export const RoutineChange = (props) => {

  const [newRoutine, setNewRoutine] = useState('');
  const [loading, setLoading] = useState(true);

  let routineList = useRef([]) 


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        routineList.current = await homeSql.getAllRoutines()
        setLoading(false)
      } catch (error) {
        showMessage({
          message: 'Error',
          description: 'There was an error.',
          type: "danger",
        });
        console.error(error)
      }
    }
    fetchData()
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

      routineList.current = await homeSql.getAllRoutines()

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

  const RoutineRecord = ({routine}) => { 
    return (
      <View style={styles.routineRecordContainer}>
        
        <View style={{flex: 1}}>
          <Text>Day {routine.dayNum + ':  ' + routine.routine}</Text>
        </View>
  
        <View style={styles.iconsContainer}>
          <Pressable onPress={() => { sendRoutineFuntion('moveUp', routine.id) }}>
            <MaterialIcon name='arrow-up' size={20} color={Colors.primary} />
          </Pressable>

          <Pressable onPress={() => { sendRoutineFuntion('delete', routine.id) }}>
            <Icon name="trash" size={20} color={Colors.highlight} />
          </Pressable>
        </View>
        
      </View>
    )
  }

  return (
    <>
      <View style={[styles.row, styles.marginHorizonal_M, styles.marginBottom_S]}>
        <TextInput
          style={[styles.input, styles.marginRight]}
          onChangeText={setNewRoutine}
          value={newRoutine}
          placeholder="New Strength Routine"
        />
        <Pressable
          style={styles.circleButton}
          onPress={() => { sendRoutineFuntion('add') }}
        >
          <MaterialIcon name='check-outline' size={20} color={Colors.black} />
        </Pressable>
      </View>

      {loading == true && (
        <View style={[styles.center, styles.fillSpace]}>
          <Wander size={70} color={Colors.primary} />
        </View>
      )}
      
      {routineList.current && routineList.current.length > 0 && loading == false && (
        <>
          {routineList.current.map((routine, index) => (
            <RoutineRecord key={index} routine={routine} />
          ))}
        </>
      )}
    </>
  )
}

export const RoutineMain = (props) => {

  const [loading, setLoading] = useState(false);
  const [todaysRoutine, setTodaysRoutine] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        let routineID = await getRoutineIDFromSettings('todaysRoutine')
        
        if(routineID != null) {
          let returnedRoutine = await homeSql.getRoutineByID(routineID)
          setTodaysRoutine(returnedRoutine)
        }
        else {
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

      if (!settingValue || settingValue.length == 0) {
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
        <View style={styles.center}>
          <Text>{todaysRoutine.routine + ' Day'}</Text>
        </View>
      )}
    </>
  )
}