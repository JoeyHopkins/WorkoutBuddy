import { StyleSheet, Text, View, Button, Dimensions, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'
import EntyoIcon from 'react-native-vector-icons/Entypo';

import * as workoutSql from '../../controllers/workouts.controller'
import { useEffect, useState } from 'react';
import { Wander } from 'react-native-animated-spinkit'
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from "react-native-flash-message";

const width = Dimensions.get('window').width

export function EditWorkout({workoutMode, setPageMode, routineSelected, navigation}) {

  const [loading, setLoading] = useState(false)
  const [workoutList, setWorkoutList] = useState([])
  const [newWorkout, setNewWorkout] = useState('')

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

          message = await sql.addWorkout(newWorkout, routineSelected.current.id)

          setNewWorkout('')
          break;
        case 'delete':
          message = await workoutSql.deleteCardioWorkout(id)
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
          <Pressable
            style={styles.circleButton}
            onPress={() => { workoutConnection('add') }}
          >
            <MaterialIcon name='check-outline' size={20} color={Colors.black} />
          </Pressable>
        </View>

        <View style={styles.fillSpace}>
          {loading == true && (
            <Wander size={150} color={Colors.primary} />
          )}
          {loading == false && workoutList.length == 0 && (
            <Text>No workouts exist...</Text>
          )}

          {loading == false && workoutList.length > 0 && (
            <>
              {workoutList.map((workout, index) => (
                <CardioWorkoutRecord key={index} workout={workout} />
              ))}
            </>
          )}
        </View>
      </View>

      <View style={styles.center}>
        <Pressable 
          style={styles.circleButton}
          onPress={() => { 
            setPageMode('Main') 
            navigation.setOptions({headerTitle: 'Workout'});
          }}
          >
          <EntyoIcon name={'cross'} size={20} color={Colors.black} />
        </Pressable>      
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    paddingTop: 20,
    marginHorizontal: 20,
    borderColor: Colors.primary,
    overflow: 'hidden',
    flex: 1,
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
    marginVertical: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
  },
  fillSpace: {
    flex: 1,
  },
  addWorkoutContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginBottom: 30,
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