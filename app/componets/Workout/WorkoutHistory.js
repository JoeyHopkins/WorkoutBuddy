import { Alert, Text, View, Dimensions, Pressable, ScrollView, Switch} from 'react-native';
import styles from '../../config/styles';
import * as historySql from '../../controllers/workoutHistory.controller'
import React, {useState, useEffect, useRef, memo} from 'react';
import { showMessage } from "react-native-flash-message";
import { alterSets, SetsRecord, prepSetsForDB } from './StrengthWorkout'
import * as Utils from '../../utils'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Colors from '../../config/colors'
import { Wander } from 'react-native-animated-spinkit'

const width = Dimensions.get('window').width;
const slideWidth = width * 0.8 - 0;

export const WorkoutHistory = ({navigation, route}) => {
  const { workoutID, workoutName, trackTotal } = route.params;
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const routineList = useRef([])
  const pagePrev = useRef(1)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [page])
  
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

    if(history.length == 0 || pagePrev.current !== page) {
      response = await historySql.getWorkoutHistory(workoutID, page, pageSize)
      tempHistory = response.items
      setTotalItems(response.totalItems)

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

  function setStateChanged(workout) {
    workout.changed = true
  }

  function updateWorkout(workout) {
    const {reps, total, weight, weightTotal} = prepSetsForDB(workout)
    
    let params = {
      reps: reps,
      total: total,
      weight: weight,
      weightTotal: weightTotal,
    }

    try {
      historySql.updateWorkoutSummary(workout.id, params)
      workout.changed = false
      showMessage({
        message: 'Success',
        description: 'Workout has been updated',
        type: "success",
      });
      getData()
    }
    catch(error) {
      showMessage({
        message: 'Error',
        description: 'There was an error. ' + error,
        type: "danger",
      });
    }
  }

  const HistoryItem = ({ workout, index }) => {
    let workoutDate = new Date(workout.date)

    if(!workout.sets)
      workout.sets = []

    if(workout.sets.length == 0)
      alterSets('init', workout.sets, null, workout.reps, workout.weight)

    return (
      <>
        <View style={[styles.homeContainer, styles.marginBottom_S]}>
          <View style={[styles.center, styles.marginVertical_S]}>
            <Text style={styles.title}>{Utils.formatISOtoDisplayDate(workoutDate)}</Text>
          </View>

          <View style={[styles.marginBottom, styles.homeContainer]}>
            {workout.sets && workout.sets.map((set, index) => (
              <SetsRecord 
                key={index}
                set={set}
                index={index}
                workout={workout}
                getData={getData}
                showStats={false}
                setStateChanged={setStateChanged}
              />
            ))}
          </View>
          <View style={styles.center}>
            <MaterialIcon
              onPress={() => {
                alterSets('addNew', workout.sets)
                setStateChanged(workout)
                getData()
              }}
              name="plus-circle-outline"
              size={40}
              color={Colors.primary}
              style={styles.marginBottom_S}
            />
          </View>


          <View style={[styles.center, styles.marginBottom_S]}>
            <Pressable
              style={[
                styles.circleButton, 
                workout.changed ? '' : styles.disabled 
              ]}
              disabled={workout.changed == undefined ? true : false}
              onPress={() => { 
                updateWorkout(workout)
              }}
            >
              <MaterialIcon name='check-outline' size={20} color={Colors.black} />
            </Pressable>
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

        {loading == true && (
          <View style={[styles.center, styles.fillSpace, styles.marginTop_M]}>
            <Wander size={300} color={Colors.primary} />
          </View>
        )}
        {loading == false && (
          <>
            <View style={styles.fillSpace}>
              {history.map((workout, index) => (
                <HistoryItem key={index} workout={workout} index={index} />
              ))}
            </View>

            <View style={styles.center}>
              <Text>{((page - 1) * pageSize) + 1} - {(page * pageSize) > totalItems ? totalItems : (page * pageSize)} of {totalItems} </Text>
            </View>

            <View style={[styles.row, styles.spread, styles.marginHorizonal_L]}>
              <Pressable
                onPress={() => { 
                  pagePrev.current = page;
                  setPage(page - 1)
                }}
                disabled={page <= 1}
              >
                <MaterialIcon 
                  name='arrow-left-bold-outline' 
                  size={100}
                  color={page <= 1 ? Colors.backgroundGray : Colors.primary} 
                />
              </Pressable>
              <Pressable
                onPress={() => { 
                  pagePrev.current = page;
                  setPage(page + 1)
                }}
                disabled={(page * pageSize) > totalItems}
              >
                <MaterialIcon 
                  name='arrow-right-bold-outline' 
                  size={100} 
                  color={(page * pageSize) > totalItems ? Colors.backgroundGray : Colors.primary}
                />
              </Pressable>
            </View>

          </>
        )}
      </ScrollView>
    </>
  );
}