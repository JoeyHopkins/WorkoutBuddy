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

const width = Dimensions.get('window').width

export function EditWorkout({workoutMode, setCompleted, routineSelected, navigation}) {

  const [loading, setLoading] = useState(false)
  const [workoutList, setWorkoutList] = useState([])
  const [newWorkout, setNewWorkout] = useState('')
  const [distanceEnabled, setDistanceEnabled] = useState(false)
  const routineList = useRef([])
  const panelRef = useRef(null);

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

          const lowerCaseWorkout = newWorkout.toLowerCase();
          const capitalizedWorkout = lowerCaseWorkout.charAt(0).toUpperCase() + lowerCaseWorkout.slice(1);

          let params = {
            newWorkout: capitalizedWorkout,
            routineId: id,
            distanceEnabled: distanceEnabled,
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

            <View style={[styles.fillSpace]}>
              <Text>{matchingRoutine.routine}</Text>
            </View>

            <View style={[styles.fillSpace]}>
              {(!workout.trackTotal || workout.trackTotal == 0) && (
                <MaterialIcon name="arm-flex-outline" size={20} color={Colors.secondary} />
              )}
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
            placeholder="New Workout Name"
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

          <Pressable
            style={styles.circleButton}
            onPress={() => {
              Keyboard.dismiss();
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

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 20,
    paddingTop: 20,
    marginHorizontal: 20,
    borderColor: Colors.primary,
    overflow: 'hidden',
    flex: 1,
  },
  addWorkoutContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  switchText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: -10,
    color: Colors.primary,
  },
  switchContainer: {
    marginBottom: -15,
    borderColor: Colors.primary,
    marginLeft: 20,
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    marginLeft: 20,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillSpace: {
    flex: 1,
  },
  workoutRecordContainer: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginHorizontal: -30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    marginTop: 1,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  marginBottom: {
    marginBottom: 10,
  },
  listItemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  drawerContainer: {
    marginHorizontal: -21,
  },
});