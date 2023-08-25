import { Alert, Text, View, Dimensions, Pressable, ScrollView, Switch} from 'react-native';
import styles from '../../config/styles';
import * as historySql from '../../controllers/workoutHistory.controller'
import React, {useState, useEffect, useRef, memo} from 'react';
import { showMessage } from "react-native-flash-message";
import * as homeSql from '../../controllers/home.controller'

const width = Dimensions.get('window').width;
const slideWidth = width * 0.8 - 0;

export const WorkoutHistory = ({navigation, route}) => {
  const { workoutID, workoutName } = route.params;
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
    setHistory(await historySql.getWorkoutHistory(workoutID, 0, 10))
  }
  const HistoryItem = ({ workout, index }) => {
    return (
      <>
        <View style={[styles.row, styles.spread]}>
          <Text>{workout.date}</Text>
          <Text>{workout.reps}</Text>
          <Text>{workout.weight}</Text>
        </View>
      </>
    )
  };

  return (
    <>
      <ScrollView>
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