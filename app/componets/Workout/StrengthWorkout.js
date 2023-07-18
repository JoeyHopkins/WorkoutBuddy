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
        routineList.current = await homeSql.getAllRoutines()
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
      const ids = workouts.map(workout => workout.id);
      const idList = ids.join(', ');
      let workoutList = await workoutSql.getAllStrengthWorkoutsByRoutine(routineID, idList, true)
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

  const WorkoutItem = ({ item }) => {
    if(!item.sets)
      item.sets = []

    if(item.sets.length == 0)
      item.sets.push({
        rep: 0,
        weight: 0,
      })

    return (
      <View style={[styles.homeContainer, styles.marginTop_S]}>

        <View style={[styles.center, styles.marginTop_M]}>
          <Pressable
            onPress={() => {
              alterWorkoutList('remove', item)
            }}
          >
            <MaterialIcon
              name="close-outline"
              size={22}
              color={Colors.black}
            />
          </Pressable>
        </View>
        
        <Text style={[styles.title, styles.marginVertical_S]}>{item.name}</Text>

        <View style={[styles.center, styles.marginBottom]}>

          {item.sets && item.sets.map((set, index) => (
            <SetsRecord key={index} set={set} />
          ))}

        </View>

        <Pressable
          style={styles.button}
          onPress={() => {
            item.sets.push({
              rep: 0,
              weight: 0,
            })
            getData()
          }}
        >
          <Text>Add Set</Text>
        </Pressable>

      </View>
    );
  };

  const SetsRecord = ({set}) => {
    return (
      <>
        <Text>{JSON.stringify(set)}</Text>
      </>
    )
  }



  function alterWorkoutList (type, workout) {
    switch (type) {
      case 'add':
        workouts.push(workout)
        break;
      case 'remove':
        const index = workouts.findIndex(item => item.id === workout.id);
        if (index !== -1) {
          workouts.splice(index, 1);
        }
        break;
    }

    getData()
  }

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
          onPress={() => {
            alterWorkoutList('add', workout)
            panelRef.current.togglePanel()
          }}
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

        <View>
          <ScrollView>
            {workoutList.map((workout, index) => (
              <WorkoutsRecord key={index} workout={workout} />
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }

  return (
    <>
      <ScrollView>
        <View style={styles.fillSpace}>
          {workouts.map((item, index) => (
            <WorkoutItem key={index} item={item} />
          ))}
        </View>
        <View style={styles.center}>
          <MaterialIcon
            onPress={() => panelRef.current.togglePanel()}
            name="plus-circle-outline"
            size={40}
            color={Colors.primary}
            style={styles.marginVertical_S}
          />
        </View>
      </ScrollView>
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