import { StyleSheet, Text, View, Button, Dimensions, Pressable} from 'react-native';
import * as Colors from '../../config/colors'
import EntyoIcon from 'react-native-vector-icons/Entypo';

import * as workoutSql from '../../controllers/workouts.controller'
import { useEffect, useState } from 'react';
import { Wander } from 'react-native-animated-spinkit'

export function EditWorkout({workoutMode, setPageMode, routineSelected, navigation}) {

  const [loading, setLoading] = useState(false)
  const [workoutList, setWorkoutList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if(workoutMode === 'cardio')
        navigation.setOptions({ headerTitle: 'Cardio Workouts' });
      else
        navigation.setOptions({ headerTitle: routineSelected.current.routine + ' Workouts' });

      await getData()
      setLoading(false)
    }
    fetchData()
  }, [])

  async function getData() {
    try {
      let workoutList = await workoutSql.getAllCardioWorkouts()
      console.log('workoutList')
      console.log(workoutList)
      setWorkoutList(workoutList)
    } catch (error) {
      // showMessage({
      //   message: 'Error',
      //   description: 'There was an error.',
      //   type: "danger",
      // });
      console.error(error)
    }
  }

  return (
    <> 
      <View style={styles.homeContainer}>
        <View style={styles.centerAll}>
          {loading == true && (
            <Wander size={150} color={Colors.primary} />
          )}
          {loading == false && (
            <Text>No workouts exist...</Text>
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
  centerTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});