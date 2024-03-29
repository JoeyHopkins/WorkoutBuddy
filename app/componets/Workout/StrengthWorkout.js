import { Text, View, Pressable, ScrollView, Alert, DrawerLayoutAndroid } from "react-native"
import * as Colors from '../../config/colors'
import BottomSheet from 'react-native-simple-bottom-sheet';
import { useEffect, useRef, useState } from "react";
import { showMessage } from "react-native-flash-message";
import * as homeSql from '../../controllers/home.controller'
import * as workoutSql from '../../controllers/workouts.controller'
import * as strengthSql from '../../controllers/strengthWorkouts.controller'
import * as activitiesSQL from '../../controllers/activities.controller'
import styles from '../../config/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import InputSpinner from "react-native-input-spinner";
import * as Utils from "../../utils";
import settingSql from '../../controllers/settings.controller'

export const StrengthWorkout = ({ navigation, setPageMode, workouts, routineID, submitTrigger, setSubmitTrigger }) => {

  const [loading, setLoading] = useState(true);
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


  useEffect(() => {
    if(submitTrigger == true)
      submitWorkout();
  }, [submitTrigger])

  async function submitWorkout() {

    for(let workout of workouts)
      for(let set of workout.sets)
        if(set.rep == 0 || (workout.trackTotal == 0 && set.weight == 0))
          {
            showMessage({
              message: 'Error!!',
              description: 'Workouts cannot be empty',
              type: "danger",
            })
            setSubmitTrigger('false')
            return
          }

    try {
      for(let workout of workouts) {
        let { id} = workout
        let now = new Date().toISOString();
        const {reps, total, weight, weightTotal} = prepSetsForDB(workout)

        let params = {
          date: now,
          reps: reps,
          total: total,
          weight: weight == '' ? null : weight,
          weightTotal: weightTotal == 0 ? null : weightTotal,
        }

        let result = await strengthSql.insertStrengthWorkoutSummary(id, params)
        let resultOverall = await strengthSql.runAgainstOverallBest(id, params)
      }

      const routine = routineList.current.find(routine => routine.id === routineID);
      await activitiesSQL.addActivity(routine.routine + ' Day', Utils.getCurrentLocalISOStringDate(), 'strength')
      await settingSql.updateRoutineSetting(routine.id);

      showMessage({
        message: 'Success!!',
        description: 'Workout submitted successfully',
        type: "success",
      })
      setPageMode('Main');
      navigation.setOptions({ headerTitle: 'Workout' });

    }
    catch (err) {
      showMessage({
        message: 'Error',
        description: 'There was an error. ' + err.message,
        type: "danger",
      });
      console.error(err);
    }
    setSubmitTrigger('false')
  }

  async function getData() {
    try {
      const ids = workouts.map(workout => workout.id);
      const idList = ids.join(', ');
      let workoutList = await workoutSql.getAllStrengthWorkoutsByRoutine(routineID, idList, true)
      let personalBests = await strengthSql.getPersonalBestsByWorkoutID(idList)
      let lastWorkouts = await strengthSql.getLastWorkoutSummaryByWorkoutID(ids)

      personalBests.forEach((pbItem) => {
        const workoutId = pbItem.workoutId;
        const workout = workouts.find((workout) => workout.id === workoutId);
        const record = JSON.parse(pbItem.record);

        workout.repsBySet = record.bySet.reps.split(',');
        workout.repsByTotal = record.byTotal.reps.split(',');
        workout.weightBySet = (record.bySet && record.bySet.weight) ? record.bySet.weight.split(',') : 'N/A'
        workout.weightByTotal = (record.byTotal && record.byTotal.weight) ? record.byTotal.weight.split(',') : 'N/A'
      });

      lastWorkouts.forEach((prevWorkout) => {
        
        if(prevWorkout == undefined)
          return 

        const workoutId = prevWorkout.workoutId;
        const workout = workouts.find((workout) => workout.id === workoutId);        
  
        workout.repsPrev = prevWorkout.reps ? prevWorkout.reps.split(',') : 'N/A'
        workout.weightPrev = prevWorkout.weight ? prevWorkout.weight.split(',') : 'N/A'
      });      

      setWorkoutList(workoutList)
    } 
    catch (error) {
      showMessage({
        message: 'Error',
        description: 'There was an error. ' + error,
        type: "danger",
      });
    }

    return
  }


  function alterWorkoutList (type, workout) {
    switch (type) {
      case 'add':
        workouts.push(workout)
        break;
      case 'remove':
        const index = workouts.findIndex(item => item.id === workout.id);
        if (index !== -1)
          workouts.splice(index, 1);
        break;
    }

    getData()
  }

  const WorkoutItem = ({ workout, index }) => {
    if(!workout.sets)
      workout.sets = []

    if(workout.sets.length == 0)
      alterSets('init', workout.sets)

    if(!workout.edit)
      workout.edit = false

    if(!workout.edit)
      return (
        <>
          <Pressable 
            style={[
              styles.marginVertical_S,
              styles.paddingVertical_S,
              styles.center,
              styles.homeContainer,
              styles.row
            ]}
            onPress={() => {
              workouts.forEach((workout, idx) => {
                workout.edit = idx === index;
              });
              getData();
            }}
          >
            <Text style={[styles.title, styles.marginHorizonal_S]}>{workout.name}</Text>
            <View>
              {workout.trackTotal == true && (
                <MaterialIcon name='sigma' size={20} color={Colors.secondary} />
              )}
              {workout.trackTotal == false && (
                <MaterialIcon name='arm-flex-outline' size={20} color={Colors.secondary} />
              )}
            </View>
          </Pressable>
        </>
      )
    else
      return (
        <View style={[styles.homeContainer, styles.marginTop_S]}>

          <View style={[styles.center, styles.marginTop_M]}>
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Warning',
                  'Are you sure you want to remove workout? Any workout progress will be lost',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => { alterWorkoutList('remove', workout) },
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <MaterialIcon
                name="close-outline"
                size={22}
                color={Colors.black}
              />
            </Pressable>
          </View>

          <View style={[styles.marginTop_S, styles.center, styles.row]}>

            <View style={[styles.fillSpace]}></View>
            <Pressable
              onPress={() => {
                workout.edit = false
                getData()
              }}
            >
              <Text style={[styles.title]}>{workout.name}</Text>
            </Pressable>

            <View style={[styles.fillSpace]}>
              {workout.trackTotal == true && (
                <MaterialIcon style={styles.marginLeft} name='sigma' size={20} color={Colors.secondary} />
              )}
              {workout.trackTotal == false && (
                <MaterialIcon style={styles.marginLeft} name='arm-flex-outline' size={20} color={Colors.secondary} />
              )}
            </View>
          </View>

          <View style={[styles.marginVertical_S, styles.center]}>
            <Pressable
              onPress={() => {
                navigation.navigate('Workout History', {workoutID: workout.id, workoutName: workout.name, trackTotal: workout.trackTotal})
              }}
            >
              <EntypoIcon name='magnifying-glass' size={30} color={Colors.secondary} />
            </Pressable>
          </View>

          <View style={[styles.marginBottom, styles.homeContainer]}>
            {workout.sets && workout.sets.map((set, index) => (
              <SetsRecord
                key={index}
                set={set}
                index={index}
                workout={workout}
                getData={getData}
                showStats={true}
              />
            ))}
          </View>

          <View style={styles.center}>
            <MaterialIcon
              onPress={() => {
                alterSets('addNew', workout.sets)
                getData()
              }}
              name="plus-circle-outline"
              size={40}
              color={Colors.primary}
              style={styles.marginVertical_S}
            />
          </View>
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
          {workouts.map((workout, index) => (
            <WorkoutItem key={index} workout={workout} index={index} />
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

exports.prepSetsForDB = (workout) => {
  return prepSetsForDB(workout)
}

function prepSetsForDB(workout) {
  let { trackTotal, sets, id} = workout
  let total = 0, weightTotal = 0
  let reps = '', weight = ''

  for(let set of sets) {
    total += +set.rep
    reps += set.rep + ','
    if(trackTotal == 0){
      weightTotal += set.weight * set.rep
      weight += set.weight + ','
    }
  }

  reps = reps.substring(0, reps.length - 1)
  weight = weight.substring(0, weight.length - 1)

  return {reps, total, weight, weightTotal}
}

exports.alterSets = (type, sets, index = null, reps = null, weight = null) => {
  alterSets(type, sets, index, reps, weight)
}

function alterSets(type, sets, index = null, reps = null, weight = null) {
  switch (type) {
    case 'init':
      if(reps != null && weight != null) {
        for(let i in reps) {
          sets.push({
            rep: reps[i],
            weight: weight[i],
            edit: false,
          })          
        }
      }
      else
        sets.push({
          rep: 0,
          weight: 0,
          edit: true,
        })
      break; 
    case 'addNew':
      sets.forEach((set, idx) => {
        set.edit = false;
      });

      sets.push({
        rep: sets[sets.length - 1].rep,
        weight: sets[sets.length - 1].weight,
        edit: true,
      });
      break;
    case 'remove':
      if (index !== null && index >= 0 && index < sets.length) {
        sets.splice(index, 1);
      }
      break;
    case 'editMode':
      if (index !== null && index >= 0 && index < sets.length)
        sets.forEach((set, idx) => {
          set.edit = idx === index;
        });
      break;
    case 'minimize':
      if (index !== null && index >= 0 && index < sets.length)
        sets[index].edit = false;
      break;
    default:
      break;
  }
}

export const SetsRecord = ({set, index, workout, getData, showStats, setStateChanged}) => {

  if(!workout.repsPrev)
    workout.repsPrev = []
  if(!workout.repsByTotal)
    workout.repsByTotal = []
  if(!workout.repsBySet)
    workout.repsBySet = []
  if(!workout.weightPrev)
    workout.weightPrev = []
  if(!workout.weightBySet)
    workout.weightBySet = []
  if(!workout.weightByTotal)
    workout.weightByTotal = []

  //Read
  if(!set.edit)
    return (
      <>
        <Pressable 
          style={[
            styles.fillSpace, 
            index + 1 != workout.sets.length ? styles.listItemContainer : styles.paddingVertical_S,
            styles.row,
          ]}
          onPress={() => {
              alterSets('editMode', workout.sets, index)
              getData()  
          }}
        >
          <View style={[styles.center, styles.marginLeft]}>
            <Text style={[styles.smallTitle]}>{'Set: ' + (index + 1)}</Text>
          </View>

          <View style={[
            styles.fillSpace, 
            styles.row, 
            styles.center, 
            styles.spread,
          ]}>
            <Text style={[styles.centerText, styles.fillSpace]}>{'Reps: ' + set.rep}</Text>
            
            {workout.trackTotal == 0 && (
              <Text style={[styles.centerText, styles.fillSpace]}>{'Weight: ' + set.weight}</Text>            
            )}
          </View>

        </Pressable>
      </>
    )
  else
    //Write
    return (
      <>
        <View style={[styles.fillSpace, 
          index + 1 != workout.sets.length ? styles.listItemContainer : styles.paddingVertical_S
        ]}>

          <View style={[styles.center, styles.marginVertical_S]}>
            <Pressable
              onPress={() => { 
                alterSets('remove', workout.sets, index)
                
                if(!showStats)
                  setStateChanged(workout)

                getData()
              }}
            >
              <MaterialIcon
                name="close-outline"
                size={22}
                color={Colors.black}
              />
            </Pressable>
          </View>
          {showStats && (
            <View style={[styles.homeContainer]}>
              <Pressable
                onPress={() => { 
                  alterSets('minimize', workout.sets, index)  
                  getData()
                }}
              >
                <View style={[styles.title]}>
                  <Text style={[styles.smallTitle]}>{'Set: ' + (index + 1)}</Text>
                </View>
              </Pressable>

              <View style={[styles.row, styles.spread, styles.marginHorizonal_S, styles.marginVertical_M]}>

                <View>
                  <Text>Last time:</Text>
                  {workout.trackTotal == 1 && (
                    <Text>{workout.repsPrev[index] ? workout.repsPrev[index] + ' Reps' : 'N/A'}</Text>
                  )}
                  {workout.trackTotal == 0 && workout.repsPrev != [] && workout.weightPrev != [] && (
                    <>
                      <View style={styles.row}>
                      <Text>{workout.repsPrev[index] ? workout.repsPrev[index] + ' @ ' : 'N/A'}</Text>
                      <Text>{workout.weightPrev[index] ? workout.weightPrev[index] + ' lbs' : ''}</Text>
                      </View>
                    </>
                  )}
                </View>

                <View>
                  <Text>Workout best:</Text>

                  {workout.trackTotal == 1 && (
                    <Text>{workout.repsByTotal[index] ? workout.repsByTotal[index] + ' Reps' : 'N/A'}</Text>
                  )} 
                  {workout.trackTotal == 0 && (
                    <>
                      <View style={styles.row}>
                        <Text>{workout.repsByTotal[index] ? workout.repsByTotal[index] + ' @ ' : 'N/A'}</Text>
                        <Text>{workout.weightByTotal[index] ? workout.weightByTotal[index] + ' lbs' : ''}</Text>
                      </View>
                    </>
                  )}
                </View>

                <View>
                  <Text>Set Best:</Text>

                  {workout.trackTotal == 1 && (
                    <Text>{workout.repsBySet[index] ? workout.repsBySet[index] + ' Reps' : 'N/A'}</Text>
                  )} 

                  {workout.trackTotal == 0 && (
                    <>
                      <View style={styles.row}>
                        <Text>{workout.repsBySet[index] ? workout.repsBySet[index] + ' @ ' : 'N/A'}</Text>
                        <Text>{workout.weightBySet[index] ? workout.weightBySet[index] + ' lbs' : ''}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}
          {!showStats && (
            <Pressable
              onPress={() => { 
                alterSets('minimize', workout.sets, index)  
                getData()
              }}
            >
              <View style={[styles.title]}>
                <Text style={[styles.smallTitle]}>{'Set: ' + (index + 1)}</Text>
              </View>
            </Pressable>
          )}
          <View style={[styles.row]}>
            <View style={[styles.inputSpinnerContainer, styles.fillSpace, styles.center, styles.marginVertical_M]}>
              <Text>{'Reps'}</Text>
              <InputSpinner
                value={set.rep}
                onChange={(num) => {
                  set.rep = num;
                  if(!showStats && !workout.changed)
                  {
                    setStateChanged(workout)
                    getData()
                  }
                }}
                style={[styles.spinner]}
                buttonStyle={styles.inputSpinnerButtonContainer}
                skin="default"
                max={9999}
                colorMax={Colors.primary}
                colorMin={Colors.primary}
                color={Colors.secondary}
              />
            </View>

            {workout.trackTotal == 0 && (
              <View style={[styles.inputSpinnerContainer, styles.fillSpace, styles.center, styles.marginVertical_M]}>
                <Text>{'Weight'}</Text>
                <InputSpinner
                  value={set.weight}
                  onChange={(num) => {
                    set.weight = num;
                    if(!showStats)
                    {
                      setStateChanged(workout)
                      getData()
                    }
                  }}
                  style={[styles.spinner]}
                  buttonStyle={styles.inputSpinnerButtonContainer}
                  skin="default"
                  max={9999}
                  type={"real"}
                  step={5}
                  colorMax={Colors.primary}
                  colorMin={Colors.primary}
                  color={Colors.secondary}
                />
              </View>
            )}
          </View>
        </View>
      </>
    )
}