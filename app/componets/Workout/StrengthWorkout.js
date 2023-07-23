import { Text, View, Pressable, ScrollView, Alert } from "react-native"
import * as Colors from '../../config/colors'
import BottomSheet from 'react-native-simple-bottom-sheet';
import { useEffect, useRef, useState } from "react";
import { showMessage } from "react-native-flash-message";
import * as homeSql from '../../controllers/home.controller'
import * as workoutSql from '../../controllers/workouts.controller'
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

  function submitWorkout() {

    for(let workout of workouts) {

      let { trackTotal, sets, id} = workout
      
      // //REps and weight
      // if(trackTotal == 0) {
        // }
        // //Totals Only
        // else 
        if(trackTotal == 1) {

          let total = 0
          let reps = ''
          let now = new Date()

          for(let set of sets) {
            total += set.rep
            reps += set.rep + ','
          }

          reps = reps.substring(0, reps.length - 1)

          // personal best (overall based on total)

          // set best (highest rep record for that set all time)
          
          //strength workout totals db
          //id identity, workoutID, date, reps (10,10,10,10), total (40)
      }
    }

    setSubmitTrigger('false')
  }

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
                workoutSetLength={workout.sets.length}
                workoutID={workout.id}
                totalOnly={workout.trackTotal}
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

  const SetsRecord = ({set, index, workoutSetLength, workoutID, totalOnly}) => {

    //Read
    if(!set.edit)
      return (
        <>
          <Pressable 
            style={[
              styles.fillSpace, 
              index + 1 != workoutSetLength ? styles.listItemContainer : styles.paddingVertical_S,
              styles.row,
            ]}
            onPress={() => {
              for(let workout of workouts)
                if(workoutID == workout.id) {
                  alterSets('editMode', workout.sets, index)
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
              
              {totalOnly == 0 && (
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
            index + 1 != workoutSetLength ? styles.listItemContainer : styles.paddingVertical_S
          ]}>

            <View style={[styles.center, styles.marginVertical_S]}>
              <Pressable
                onPress={() => {
                  for(let workout of workouts)
                    if(workoutID == workout.id) {
                      alterSets('remove', workout.sets, index)
                      break
                    }  
                }}
              >
                <MaterialIcon
                  name="close-outline"
                  size={22}
                  color={Colors.black}
                />
              </Pressable>
            </View>

            <View style={[styles.title]}>
              <Text style={[styles.smallTitle]}>{'Set: ' + (index + 1)}</Text>
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

              {totalOnly == 0 && (
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