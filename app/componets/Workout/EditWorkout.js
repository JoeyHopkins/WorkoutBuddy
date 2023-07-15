import { StyleSheet, Text, View, Keyboard, Dimensions, Pressable, TextInput, Switch, ScrollView} from 'react-native';
import * as Colors from '../../config/colors'
import EntyoIcon from 'react-native-vector-icons/Entypo';

import * as workoutSql from '../../controllers/workouts.controller'
import * as homeSql from '../../controllers/home.controller'
import { useEffect, useState, useRef } from 'react';
import { Wander } from 'react-native-animated-spinkit'
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from "react-native-flash-message";

import BottomSheet from 'react-native-simple-bottom-sheet';

import BouncyCheckbox from "react-native-bouncy-checkbox";

import styles from '../../config/styles'; // Import the styles from GlobalStyles.js

const width = Dimensions.get('window').width

export function EditWorkout({workoutMode, setCompleted, routineSelected, navigation}) {

  const [loading, setLoading] = useState(false)
  const [workoutList, setWorkoutList] = useState([])
  const [newWorkout, setNewWorkout] = useState('')
  const [distanceEnabled, setDistanceEnabled] = useState(false)
  const routineList = useRef([])
  const panelRef = useRef(null);

  const [totalsOnly, setTotalsOnly] = useState(false);
  const [useEveryday, setUseEveryday] = useState(false);

  const toggleSwitch = () => setDistanceEnabled(previousState => !previousState);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if(workoutMode === 'cardio')
        navigation.setOptions({ headerTitle: 'Edit Cardio Workouts' });
      else
      {
        navigation.setOptions({ headerTitle: 'Edit Workouts' });
        routineList.current = await homeSql.getAllRoutines()
      }

      await workoutConnection()
      setLoading(false)
    }
    fetchData()
  }, [])

  async function workoutConnection(submissionType = null, id = null) {
    let message = ''
    let sql = null
    setLoading(true)
    
    if(workoutMode === 'cardio')
      sql = workoutSql.cardio
    else if(workoutMode === 'strength')
      sql = workoutSql.strength

    if(submissionType !== null)
      setCompleted(true)

    try {

      switch (submissionType) {
        case 'add':
          const lowerCaseWorkout = newWorkout.toLowerCase();
          const capitalizedWorkout = lowerCaseWorkout.charAt(0).toUpperCase() + lowerCaseWorkout.slice(1);

          let params = {
            newWorkout: capitalizedWorkout,
            routineId: id,
            distanceEnabled: distanceEnabled,
            totalsOnly: totalsOnly,
            useEveryday: useEveryday,
          }

          message = await sql.addWorkout(params)

          setNewWorkout('')
          break;
        case 'delete':
          message = await sql.deleteWorkout(id)
          break;
      }

      let workoutList = await sql.getAllWorkouts()

      setWorkoutList(workoutList)

      if(submissionType != null)
        showMessage({
          message: 'Success!',
          description: message,
          type: "success",
        });
    }
    catch (err) {
      console.log(err)
      showMessage({
        message: 'Error',
        description: err,
        type: "danger",
      });
    }

    setLoading(false)
  }

  const WorkoutRecord = ({workout}) => {

    if(workoutMode === 'cardio')
      return (
        <View style={styles.workoutRecordContainer}>
          
          <View>
            <Text>{workout.name}</Text>
          </View>
    
          {workout.trackDistance == 1 && (
            <EntyoIcon name="ruler" size={20} color={Colors.secondary} />
          )}
          
          <Pressable onPress={() => { workoutConnection('delete', workout.id) }}>
            <Icon name="trash" size={20} color={Colors.highlight} />
          </Pressable>
        </View>
      )
    else
    {
      let matchingRoutine = {};

      matchingRoutine = routineList.current.find(routine => {
        if (routine.id === workout.routineId)
          return true;
        return false;
      });

      return (
        <>
          <View style={styles.workoutRecordContainer}>
            
            <View style={[styles.fillSpace]}>
              <Text>{workout.name}</Text>
            </View>

            <View style={[styles.marginHorizonal, styles.fillSpace]}>
              <Text>{matchingRoutine.routine}</Text>
            </View>


            <View style={[styles.marginHorizonal, styles.fillSpace, styles.row]}>

              <View style={[styles.fillSpace]}>
                {(!workout.trackTotal || workout.trackTotal == 0) && (
                  <MaterialIcon name="arm-flex-outline" size={20} color={Colors.secondary} />
                )}
                {(workout.trackTotal == 1) && (
                  <MaterialIcon name="plus-minus-variant" size={20} color={Colors.secondary} />
                )}
              </View>

              <View style={[styles.fillSpace]}>
                {workout.everyday.toString() === '1' && (
                  <MaterialIcon name="calendar-today" size={20} color={Colors.secondary} />
                )}
              </View>

            </View>

            <View>
              <Pressable onPress={() => { workoutConnection('delete', workout.id) }}>
                <Icon name="trash" size={20} color={Colors.highlight} />
              </Pressable>
            </View>

          </View>
        </>
      )
    }  
  }

  const BottomDrawer = () => {
    return (
      <View style={styles.drawerContainer}>
        <View style={[styles.center, styles.marginBottom]}>
          <Text>Selct the routine to add workout to:</Text>
        </View>
        <ScrollView>
          {routineList.current.map((routine, index) => (
            <RoutineRecord key={index} routine={routine} />
          ))}
        </ScrollView>
      </View>
    )
  }

  const RoutineRecord = ({routine }) => {
    return (
      <Pressable
        onPress={() => {
          workoutConnection('add', routine.id)
          panelRef.current.togglePanel()
        }}
        style={[styles.listItemContainer, styles.fillSpace, styles.center]}
      >
        <Text>{routine.routine}</Text>
      </Pressable>
    )
  }

  return (
    <> 
      <View style={styles.homeContainer}>

        <View style={styles.addWorkoutContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setNewWorkout}
            value={newWorkout}
            placeholder="New Workout"
          />

          {workoutMode === 'cardio' && (
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{false: Colors.backgroundGray, true: Colors.primary}}
                thumbColor={distanceEnabled ? Colors.secondary : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={distanceEnabled}
              />
              <Text style={styles.switchText}>{'Track\nDistance'}</Text>
            </View>
          )}

          <View style={[styles.fillSpace, styles.row]}>
            <View style={[styles.fillSpace, styles.center, styles.checkboxWithText]}>
              <BouncyCheckbox
                size={25}
                disableText={true}
                fillColor={Colors.secondary}
                unfillColor={Colors.background}
                iconStyle={{ borderColor: Colors.secondary }}
                innerIconStyle={{ borderWidth: 2 }}
                onPress={() => setTotalsOnly(!totalsOnly)}
              />
              <Text style={styles.checkboxText}>Totals Only</Text>
            </View>

            <View style={[styles.fillSpace, styles.center, styles.checkboxWithText]}>
              <BouncyCheckbox
                size={25}
                disableText={true}
                fillColor={Colors.secondary}
                unfillColor={Colors.background}
                iconStyle={{ borderColor: Colors.secondary }}
                innerIconStyle={{ borderWidth: 2 }}
                onPress={() => setUseEveryday(!useEveryday)}
              />
              <Text style={styles.checkboxText}>Everyday</Text>
            </View>
          </View>

          <Pressable
            style={styles.circleButton}
            onPress={() => {
              if(Keyboard.isVisible())
              {
                Keyboard.dismiss();
                return
              }

              if(newWorkout === '') {
                showMessage({
                  message: 'Error',
                  description: 'Please enter a workout name.',
                  type: "danger",
                });
                setLoading(false)
                return
              }
              if (!/^[a-zA-Z\s]+$/.test(newWorkout)) {
                showMessage({
                  message: 'Error',
                  description: 'Workout name should only contain letters and spaces.',
                  type: 'danger',
                });    
                setLoading(false);
                return;
              }

              panelRef.current.togglePanel();
            }}
          >
            <MaterialIcon name='check-outline' size={20} color={Colors.black} />
          </Pressable>
        </View>

        <View style={ (loading == false && workoutList.length > 0) ? styles.fillSpace : [styles.fillSpace, styles.center] }>
          {loading == true && (
            <Wander size={150} color={Colors.primary} />
          )}
          {loading == false && workoutList.length == 0 && (
            <Text>No workouts exist...</Text>
          )}

          {loading == false && workoutList.length > 0 && (
            <>
              <ScrollView>
                {workoutList.map((workout, index) => (
                  <WorkoutRecord key={index} workout={workout} />
                ))}
              </ScrollView>  
            </>
          )}
        </View>
      </View>

      <BottomSheet 
        isOpen={false} 
        ref={ref => panelRef.current = ref}
        sliderMinHeight={0}
      >
        <BottomDrawer></BottomDrawer>  
      </BottomSheet>

    </>
  );
}
