import { StyleSheet, Text, View, Button, Dimensions, Pressable, TextInput, Switch, ScrollView} from 'react-native';
import * as Colors from '../../config/colors'
import EntyoIcon from 'react-native-vector-icons/Entypo';

import * as workoutSql from '../../controllers/workouts.controller'
import { useEffect, useState } from 'react';
import { Wander } from 'react-native-animated-spinkit'
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from "react-native-flash-message";

const width = Dimensions.get('window').width

export function EditWorkout({workoutMode, setCompleted, routineSelected, navigation}) {

  const [loading, setLoading] = useState(false)
  const [workoutList, setWorkoutList] = useState([])
  const [newWorkout, setNewWorkout] = useState('')
  const [distanceEnabled, setDistanceEnabled] = useState(false)

  const toggleSwitch = () => setDistanceEnabled(previousState => !previousState);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if(workoutMode === 'cardio')
        navigation.setOptions({ headerTitle: 'Cardio Workouts' });
      else
        navigation.setOptions({ headerTitle: routineSelected.current.routine + ' Workouts' });

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

          let params = {
            newWorkout: newWorkout,
            routineId: routineSelected.current.id,
            distanceEnabled: distanceEnabled,
          }

          message = await sql.addWorkout(params)

          setNewWorkout('')
          break;
        case 'delete':
          message = await sql.deleteWorkout(id)
          break;
      }

      let workoutList = await sql.getAllWorkouts(routineSelected.current.id)
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

  const CardioWorkoutRecord = ({workout}) => {
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
              onPress={() => { workoutConnection('add') }}
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
                  <CardioWorkoutRecord key={index} workout={workout} />
                ))}
              </ScrollView>  
            </>
          )}
        </View>
      </View>
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
});