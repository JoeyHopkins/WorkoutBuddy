import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native"
import * as Colors from '../../config/colors'
import BottomSheet from 'react-native-simple-bottom-sheet';
import { useEffect, useRef, useState } from "react";
import { showMessage } from "react-native-flash-message";
import * as homeSql from '../../controllers/home.controller'
import * as workoutSql from '../../controllers/workouts.controller'
import styles from '../../config/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const StrengthWorkout = ({ navigation, setPageMode, workouts, routineID }) => {

  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const [workoutList, setWorkoutList] = useState([]);
  const routineList = useRef([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await getData()
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

  async function getData() {
    try {
      let workoutList = await workoutSql.getAllStrengthWorkoutsByRoutine(routineID)
      routineList.current = await homeSql.getAllRoutines()
      setWorkoutList(workoutList)
    } 
    catch (error) {
      showMessage({
        message: 'Error',
        description: 'There was an error.',
        type: "danger",
      });
    }

    return
  }

  const Record = ({ item }) => {
    return (
      <View style={[styles.homeContainer, styles.marginTop_S]}>
        <Text style={[styles.title, styles.marginVertical_S]}>{item.name}</Text>

        <View style={[styles.center, styles.marginBottom]}>
          <Text>Set 1</Text>
        </View>

        <Pressable
          style={styles.button}
        >
          <Text>Add Set</Text>
        </Pressable>

      </View>
    );
  };

  const WorkoutsRecord = ({workout}) => {

    let matchingRoutine = {};
    
    matchingRoutine = routineList.current.find(routine => {
      if (routine.id === workout.routineId)
        return true;
      return false;
    });

    return (
      <>
        <Pressable 
          style={[styles.listItemContainer]}
        >
          <View style={[styles.marginHorizonal_L, styles.row]}>

            <View style={[styles.fillSpace]}>
              <Text>{workout.name}</Text>
            </View>

            <View style={[styles.fillSpace]}>
              <Text>{matchingRoutine.routine}</Text>
            </View>


            <View style={[styles.fillSpace, styles.row]}>

              <View style={[styles.fillSpace]}>
                {(!workout.trackTotal || workout.trackTotal == 0) && (
                  <MaterialIcon name="arm-flex-outline" size={20} color={Colors.secondary} />
                )}
                {(workout.trackTotal == 1) && (
                  <MaterialIcon name="sigma" size={20} color={Colors.secondary} />
                )}
              </View>

              <View style={[styles.fillSpace]}>
                {workout.everyday.toString() === '1' && (
                  <MaterialIcon name="calendar-today" size={20} color={Colors.secondary} />
                )}
              </View>

            </View>
          </View>
        </Pressable>
      </>
    )
  }

  const BottomDrawer = () => {
    return (
      <View style={styles.drawerContainer}>
        <Pressable
          style={styles.button}
        >
          <Text>Add New Workout</Text>
        </Pressable>

        <ScrollView>
          {workoutList.map((workout, index) => (
            <WorkoutsRecord key={index} workout={workout} />
          ))}
        </ScrollView>
      </View>
    )
  }

  return (
    <>
      <View style={styles.fillSpace}>
        {workouts.map((item, index) => (
          <Record key={index} item={item} />
        ))}
        <Pressable
          style={[styles.button, styles.marginTop_S]}
        >
          <Text 
            onPress={() => panelRef.current.togglePanel()}
          >Add Workout</Text>
        </Pressable>
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