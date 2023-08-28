import { Alert, Text, View, Dimensions, Pressable, ScrollView, Switch} from 'react-native';
import styles from '../../config/styles';
import * as historySql from '../../controllers/workoutHistory.controller'
import React, {useState, useEffect, useRef, memo} from 'react';
import { showMessage } from "react-native-flash-message";
import { alterSets, SetsRecord } from './StrengthWorkout'
import * as Utils from '../../utils'

const width = Dimensions.get('window').width;
const slideWidth = width * 0.8 - 0;

export const WorkoutHistory = ({navigation, route}) => {
  const { workoutID, workoutName, trackTotal } = route.params;
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([])
  const routineList = useRef([])

  useEffect(() => {
    fetchData()
  }, [])
  
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

  async function getData() {
    let tempHistory = []

    if(history.length == 0)
    {
      tempHistory = await historySql.getWorkoutHistory(workoutID, 0, 10)

      for(let item of tempHistory)
      {
        item.reps = item.reps ? item.reps.split(',') : []
        item.weight = item.weight ? item.weight.split(',') : []
        item.trackTotal = trackTotal
      }
    }
    else
      tempHistory = [...history]

    setHistory(tempHistory)
  }

  const HistoryItem = ({ workout, index }) => {
    let workoutDate = new Date(workout.date)

    if(!workout.sets)
      workout.sets = []

    if(workout.sets.length == 0)
      alterSets('init', workout.sets, null, workout.reps, workout.weight)

    return (
      <>
        <View style={[styles.homeContainer, styles.marginTop_S]}>
          <View style={[styles.center, styles.marginVertical_S]}>
            <Text>{Utils.formatISOtoDisplayDate(workoutDate)}</Text>
          </View>

          <View style={[styles.marginBottom, styles.homeContainer]}>
            {workout.sets && workout.sets.map((set, index) => (
              <SetsRecord 
                key={index}
                set={set}
                index={index}
                workout={workout}
                getData={getData}
              />
            ))}
          </View>
        </View>
      </>
    )
  }

  return (
    <>
      <ScrollView style={styles.background}>
        <View style={[styles.center]}>
          <Text style={[styles.title, styles.marginVertical_S]}>{workoutName}</Text>
        </View>
        <View style={styles.fillSpace}>
          {history.map((workout, index) => (
            <HistoryItem key={index} workout={workout} index={index} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}