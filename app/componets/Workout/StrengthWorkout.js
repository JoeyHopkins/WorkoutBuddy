import { Text, View, Pressable, ScrollView, Alert } from "react-native"
import * as Colors from '../../config/colors'
import BottomSheet from 'react-native-simple-bottom-sheet';
import { useEffect, useRef, useState } from "react";
import { showMessage } from "react-native-flash-message";
import * as homeSql from '../../controllers/home.controller'
import * as workoutSql from '../../controllers/workouts.controller'
import * as strengthSql from '../../controllers/strengthWorkouts.controller'
import styles from '../../config/styles';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import InputSpinner from "react-native-input-spinner";

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

    for(let workout of workouts) {

      let { trackTotal, sets, id} = workout
      let total = 0, weightTotal = 0
      let reps = '', weight = ''
      let now = new Date().toISOString();

      for(let set of sets) {
        total += set.rep
        reps += set.rep + ','
        if(trackTotal == 0){
          weightTotal += set.weight
          weight += set.weight + ','
        }
      }

      reps = reps.substring(0, reps.length - 1)
      weight = weight.substring(0, weight.length - 1)

      try {
        let params = {
          date: now, 
          reps: reps, 
          total: total,
          weight: weight == '' ? null : weight,
          weightTotal: weightTotal == 0 ? null : weightTotal,
        }

        let result = await strengthSql.insertStrengthWorkoutSummary(id, params)
        let resultOverall = await strengthSql.runAgainstOverallBest(id, params)
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

  function alterSets(type, sets, index = null) {
    switch (type) {
      case 'init':
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
        if (index !== null && index >= 0 && index < sets.length) {
          sets.forEach((set, idx) => {
            set.edit = idx === index;
          });
        }
        break;
      default:
        break;
    }

    if(type != 'init')
      getData()
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

          <View style={[styles.marginVertical_S, styles.center]}>
            <Text style={[styles.title]}>{workout.name}</Text>

            {workout.trackTotal == true && (
              <MaterialIcon name='sigma' size={20} color={Colors.secondary} />
            )}
            {workout.trackTotal == false && (
              <MaterialIcon name='arm-flex-outline' size={20} color={Colors.secondary} />
            )}

          </View>

          <View style={[styles.marginBottom, styles.homeContainer]}>
            {workout.sets && workout.sets.map((set, index) => (
              <SetsRecord 
                key={index}
                set={set}
                index={index}
                workout={workout}
              />
            ))}
          </View>

          <View style={styles.center}>
            <MaterialIcon
              onPress={() => {
                alterSets('addNew', workout.sets)
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

  const SetsRecord = ({set, index, workout}) => {

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
              for(let activity of workouts)
                if(activity.id == workout.id) {
                  alterSets('editMode', activity.sets, index)
                  break
                }  
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
                onPress={() => { alterSets('remove', workout.sets, index) }}
              >
                <MaterialIcon
                  name="close-outline"
                  size={22}
                  color={Colors.black}
                />
              </Pressable>
            </View>

            <View style={[styles.homeContainer]}>
              <View style={[styles.title]}>
                <Text style={[styles.smallTitle]}>{'Set: ' + (index + 1)}</Text>
              </View>

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

            <View style={[styles.row]}>
              <View style={[styles.inputSpinnerContainer, styles.fillSpace, styles.center, styles.marginVertical_M]}>
                <Text>{'Reps'}</Text>
                <InputSpinner
                  value={set.rep}
                  onChange={(num) => {
                    set.rep = num;
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