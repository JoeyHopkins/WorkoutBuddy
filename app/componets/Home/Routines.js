
import React, {useState, useEffect, useRef} from 'react';
import { View, Text, Pressable, TextInput} from 'react-native';

import { Wander } from 'react-native-animated-spinkit'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { showMessage } from "react-native-flash-message";
import * as Colors from '../../config/colors'

import homeSql from '../../controllers/home.controller'
import settingSql from '../../controllers/settings.controller'
import styles from '../../config/styles'
import * as Utils from '../../utils'

export const RoutineChange = ({ todaysRoutine, setRefreshComponet }) => {

  const [newRoutine, setNewRoutine] = useState('');
  const [loading, setLoading] = useState(true);
  const [routineMode, setRoutineMode] = useState('Main');

  let routineList = useRef([])
  let editRoutineID = useRef(null)

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
        case 'edit':
        case 'add':
          if(newRoutine === '') {
            showMessage({
              message: 'Error',
              description: 'Please enter a routine',
              type: "danger",
            });
            setLoading(false)
            return
          }

          let newString = Utils.formatStringForDisplay(newRoutine)

          if(routineMode == 'Main')
            message = await homeSql.addRoutine(newString)
          else {
            message = await homeSql.editRoutine(editRoutineID.current, newString)
            setRoutineMode('Main')
          } 
          
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

      if(
        routineList.current.length === 0 || 
        routineList.current.length === 1 ||
        (submissionType == 'delete' && id == todaysRoutine.id) ||
        (submissionType == 'add' && editRoutineID.current == todaysRoutine.id))
        setRefreshComponet(true)

      editRoutineID.current = null;

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

      <Pressable 
        style={styles.routineRecordContainer}
        onLongPress={() => { 
          setRoutineMode('Edit')
          setNewRoutine(routine.routine)
          editRoutineID.current = routine.id
        }}
      >
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
      </Pressable>
    )
  }

  const stopEditMode = () => {
    setNewRoutine('')
    setRoutineMode('Main');
  };

  return (
    <>
      <View style={[styles.row, styles.marginHorizonal_M, styles.marginBottom_S]}>

        <TextInput
          style={[styles.input, styles.marginRight]}
          onChangeText={setNewRoutine}
          value={newRoutine}
          placeholder="New Strength Routine"
        />

        { routineMode == 'Edit' && (
          <>
            <Pressable
              style={[styles.circleButton, styles.marginRight]}
              onPress={stopEditMode}
            >
              <MaterialIcon
                name="close-outline"
                size={22}
                color={Colors.black}
              />
            </Pressable>
          </>
        )}

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

export const RoutineMain = ({ todaysRoutine, setTodaysRoutine, refreshComponet, setRefreshComponet, navigation }) => {

  const [loading, setLoading] = useState(false);

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
      setRefreshComponet(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshComponet])

  const getRoutineIDFromSettings = async (settingName) => {
    try {
  
      let settingValue = await settingSql.getSetting(settingName);

      if (!settingValue || settingValue.length == 0) {
        // Setting does not exist, create it with initial value
        await settingSql.createNewSetting(settingName, null);
        return null;
      } 
      else
        // Setting exists, retrieve the record that comes back
        return settingValue[0].config;
  
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {loading == true && (
        <View style={styles.center}>
          <Wander size={48} color={Colors.primary} />
        </View>
      )}
      {loading == false && todaysRoutine && (
        <View style={[styles.row, styles.fillSpace]}>
          <View style={[styles.fillSpace]}/>
          <Text style={[styles.fillSpace, styles.centerText]}>{todaysRoutine.routine + ' Day'}</Text>
          <Pressable
            onPress={() => { 
              const params = { routine: todaysRoutine };
              navigation.navigate('Workout', params);
            }}
            style={[styles.fillSpace]}
          >
            <MaterialIcon name='arrow-right' size={20} color={Colors.primary} />
          </Pressable>
        </View>
      )}
      {loading == false && !todaysRoutine && (
        <View style={styles.center}>
          <Text>{'No routines available...'}</Text>
        </View>
      )}
    </>
  )
}