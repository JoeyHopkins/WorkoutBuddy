import { Alert, Text, View, Dimensions, Pressable, ScrollView, Switch} from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import React, {useState, useEffect, useRef, memo} from 'react';
import * as Colors from '../../config/colors'
import Carousel from 'react-native-snap-carousel';
import * as workoutSql from '../../controllers/workouts.controller'
import * as homeSql from '../../controllers/home.controller'
import { Wander } from 'react-native-animated-spinkit'
import { EditWorkout } from './EditWorkout'
import { CardioWorkout } from './CardioWorkout'
import { StrengthWorkout } from './StrengthWorkout'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import styles from '../../config/styles';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import { showMessage } from "react-native-flash-message";

const width = Dimensions.get('window').width;
const slideWidth = width * 0.8 - 0;

const options = [
  { label: "Strength", value: "strength" },
  { label: "Cardio", value: "cardio" },
];

export const Workout = ({navigation, route}) => {
  
  const [workoutMode, setWorkoutMode] = useState("strength");
  const [pageMode, setPageMode] = useState("Main");
  const [loading, setLoading] = useState(true);
  const [routineList, setRoutineList] = useState([])
  const [workoutList, setWorkoutList] = useState([])
  const [selectedWorkouts, setSelectedWorkouts] = useState([])
  const [cardioTimeTotals, setCardioTimeTotals] = useState([])
  const [showDistanceTotals, setShowDistanceTotals] = useState(false)
  const [cardioDistanceTotals, setCardioDistanceTotals] = useState({})

  let routineSelected = useRef({})
  let routineSelectedID = useRef(-1)
  let cardioWorkouts = useRef([])
  let lastPageMode = useRef('')

  if(route.params)
    for(let routine in routineList)
      if(routineList[routine].id === route.params.routine.id)
        handleSnapToItem(parseInt(routine))

  const toggleCardioTotalSwitch = () => setShowDistanceTotals(previousState => !previousState);

  //handle header between the pages
  React.useLayoutEffect(() => {

    if(pageMode === "Workout") {
      navigation.setOptions({
        headerLeft: () => <WorkoutPageHeader />,
        headerRight: () => workoutMode == 'strength' ? <GoToEditPageHeaderIcon/> : undefined
      });
      lastPageMode.current = "Workout"
    }
    if(pageMode === "Edit")
      navigation.setOptions({
        headerLeft: () => <EditPageHeader />,
        headerRight: undefined,
      });
    else if (pageMode === "Main") {
      navigation.setOptions({
        headerLeft: undefined,
        headerRight: () => <GoToEditPageHeaderIcon/>
      });
      lastPageMode.current = "Main"
    }
    
  }, [routineList, workoutMode, pageMode]);

  useFocusEffect(
    React.useCallback(() => {
      routineSelectedID.current == -1
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    setLoading(true)
    await getData()
    setLoading(false)
  }

  useEffect(() => {
    if(pageMode === "Main") 
      fetchData()
  }, [pageMode, route])

  const GoToEditPageHeaderIcon = () => {

    const navigation = useNavigation();
  
    const handleEditButton = () => {
      if(routineList.length > 0 || workoutMode === 'cardio') {
        setPageMode('Edit') 
        navigation.setOptions({headerTitle: 'Workout'});
      }
      else
        showMessage({
          message: 'Error!',
          description: 'Please create a new routine before creating a strength workout.',
          type: "danger",
        });
    };

    return (
      <>
        <View style={styles.row}>
          {workoutMode === 'strength' && pageMode === 'Workout' && (
            <Pressable 
              style={[styles.headerEditButton]}
              onPress={() => { 
                console.log('hit submit')
              }}
            >
              <FoundationIcon name="check" size={20} color={Colors.green} />
            </Pressable>
          )}

          <Pressable 
            style={[styles.headerEditButton, styles.leftBorder]} 
            onPress={handleEditButton}
          >
            <EntypoIcon name="edit" size={20} color={Colors.yellow} 
          />
          </Pressable>
        </View>
      </>
    );
  }

  const WorkoutPageHeader = () => {
    const navigation = useNavigation();
  
    const handleBackButton = () => {
      Alert.alert(
        'Warning',
        'Are you sure you want to go back? Your current workout progress will be lost.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              setPageMode('Main');
              navigation.setOptions({ headerTitle: 'Workout' });
            },
          },
        ],
        { cancelable: false }
      );
    };
  
    return (
      <Pressable style={styles.headerButton} onPress={handleBackButton}>
        <IonIcon name="md-chevron-back" size={20} color={Colors.white} />
      </Pressable>
    );
  }

  const EditPageHeader = () => {
    const navigation = useNavigation();
    
    const handleBackButton = () => {
      setPageMode(lastPageMode.current) 
      navigation.setOptions({headerTitle: 'Workout'});
    };
  
    return (
      <Pressable style={styles.headerButton} onPress={handleBackButton}>
        <IonIcon name="md-chevron-back" size={20} color={Colors.white} />
      </Pressable>
    );
  }
    
  async function getData() {
    try {
      let routinesList = await homeSql.getAllRoutinesList()
      let strengthWorkoutList = await workoutSql.getAllStrengthWorkouts()
      cardioWorkouts.current = await workoutSql.getAllCardioWorkouts()
      let weeklyCardioTimeTotals = await workoutSql.getWeeklyCardioTimeTotals()
      let weeklyCardioDistanceTotals = await workoutSql.getWeeklyCardioDistanceTotals()

      setCardioTimeTotals(weeklyCardioTimeTotals)
      setSelectedWorkouts([])
      setCardioDistanceTotals(weeklyCardioDistanceTotals)

      for(let i in routinesList) {
        if(routinesList[i].workouts === undefined)
          routinesList[i].workouts = []

        for(let workout of strengthWorkoutList)
          if(workout.routineId === routinesList[i].id)
            routinesList[i].workouts.push(workout)
      }

      if(routineSelectedID.current == -1) {
        routineSelected.current = routinesList[routinesList.length - 1]
        routineSelectedID.current = routinesList.length - 1      
      } 

      if(workoutMode === "strength")
        setRoutineList(routinesList)
      if(workoutMode === "cardio")
        setWorkoutList(cardioWorkouts.current)

    } catch (error) {
      console.error(error)
    }
  }

  function changeWorkoutMode(value) {
    setWorkoutMode(value)
    setSelectedWorkouts([])

    if(value === "strength")
    {
      if(routineSelected.current != undefined)
        setWorkoutList(routineSelected.current.workouts)
      styles.workoutRecord.marginLeft = -90;
    }
    else if(value === "cardio") 
    {
      setWorkoutList(cardioWorkouts.current)
      styles.workoutRecord.marginLeft = -40;
    }
  }

  function addOrRemoveSelectedWorkout(workout) {

    let selected = []
    let workoutExists = false;

    if(workoutMode === "strength") {

      for (let activity of selectedWorkouts) {
        if (activity.routineId === routineSelected.current.id) {
          selected.push(activity);

          if (activity === workout) 
            workoutExists = true;
        }
      }
      
      if (!workoutExists)
        selected.push(workout);
      else
        selected = selected.filter(activity => activity !== workout);

      setSelectedWorkouts(selected);
    }
    else if(workoutMode === "cardio") {
      selected.push(workout);
      setSelectedWorkouts(selected)
    }
  }

  const CardioWorkoutRecord = ({workout}) => {
    return (
      <Pressable
        onPress={() => { 
          addOrRemoveSelectedWorkout(workout)
        }}
        style={
          selectedWorkouts.some((item) => item === workout)
            ? [styles.selected, styles.workoutRecord]
            : styles.workoutRecord
        }
      >

        <View style={[
            styles.row,
            styles.marginHorizonal_L,
          ]}>

          <View style={styles.fillSpace}>
            <Text>{workout.name}</Text>
          </View>

          <View style={[styles.fillSpace, styles.row]}>
            <View style={[styles.fillSpace, styles.row, styles.reverse]}>
              {workout.everyday == true && (
                <MaterialIcon name='calendar-today' size={20} color={Colors.secondary} />
              )}
            </View>
            <View style={[styles.fillSpace, styles.row, styles.reverse]}>

              {workout.trackDistance == true && (
                <EntypoIcon name='ruler' size={20} color={Colors.secondary} />
              )}

              {workout.trackTotal == true && (
                <MaterialIcon name='sigma' size={20} color={Colors.secondary} />
              )}
              {workout.trackTotal == false && (
                <MaterialIcon name='arm-flex-outline' size={20} color={Colors.secondary} />
              )}
            </View>
          </View>

        </View>
      </Pressable>
    )
  }

  renderSlide = ({item}) => {
    return (
      <View style={styles.slide}>
        <Text style={[styles.title, styles.marginVertical_S]}>{ item.routine }</Text>
        {loading == false && item.workouts.length == 0 && (
          <View style={[styles.center]}>
            <Text>You have no workouts...</Text>
          </View>
        )}
        {loading == false && item.workouts.length > 0 && (
          <View style={styles.strengthWorkoutListContainer}>
            <ScrollView>
              {item.workouts.map((workout, index) => (
                <CardioWorkoutRecord key={index} workout={workout} />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  function handleSnapToItem(slideIndex) {
    routineSelected.current = routineList[slideIndex]
    routineSelectedID.current = slideIndex
  };

  const StrengthTotals = () => {
    return (
      <>
        <View style={styles.totalItem}>
          <Text>Reps</Text>
          <Text>0</Text>
        </View>
        <View style={styles.totalItem}>
          <Text>Weight</Text>
          <Text>0 lbs</Text>
        </View>
        <View style={styles.totalItem}>
          <Text>Avg</Text>
          <Text>0 lbs</Text>
        </View>      
      </>
    ) 
  };

  const CardioTotals = () => {

    if(showDistanceTotals)
      return (
        <>
          <View style={styles.totalItem}>
            <Text>Weekly Distance</Text>
            <Text>{cardioDistanceTotals.mileWeek ? cardioDistanceTotals.mileWeek : 0 } miles</Text>
          </View>
          <View style={styles.totalItem}>
            <Text>Overall Distance</Text>
            <Text>{cardioDistanceTotals.mileOverall ? cardioDistanceTotals.mileOverall : 0 } miles</Text>
          </View>
        </>
      )
    else
      return (
        <>
          {cardioTimeTotals && cardioTimeTotals.length > 0 ? (
            cardioTimeTotals.map(item => (
              <View style={styles.totalItem} key={item.intensity}>
                <Text>
                  {item.intensity === 1 ? 'Low' : item.intensity === 2 ? 'Medium' : 'High'}
                </Text>
                <Text>{(item.totalDuration / 60).toFixed(2)} min</Text>
              </View>
            ))
          ) : (
            <>
              <View style={styles.totalItem}>
                <Text>Low</Text>
                <Text>0 min</Text>
              </View>
              <View style={styles.totalItem}>
                <Text>Medium</Text>
                <Text>0 min</Text>
              </View>
              <View style={styles.totalItem}>
                <Text>High</Text>
                <Text>0 min</Text>
              </View>
            </>
          )}
        </>
      );
  };

  const Main = () => {
    return (
      <>
        <View style={[styles.homeContainer, styles.marginTop_S]}>
          <View style={styles.row}>
            <View style={styles.fillSpace}></View>
            <Text style={[styles.title, styles.marginVertical_S]}>Weekly Total Summary</Text>
            
            <View style={[styles.fillSpace, styles.removeMarginBottom12, styles.center]}>
              {workoutMode === 'cardio' && (
                <Switch
                  trackColor={{false: Colors.altSecondary, true: Colors.altPrimary}}
                  thumbColor={!showDistanceTotals ? Colors.secondary : Colors.primary}
                  onValueChange={toggleCardioTotalSwitch}
                  value={showDistanceTotals}
                />              
              )}
            </View>
            
          </View>
          <View style={styles.totalContainer}>
            {workoutMode === 'strength' && (
              <StrengthTotals/>
            )}
            {workoutMode === 'cardio' && (
              <CardioTotals/>
            )}
          </View>
        </View>
        <View style={styles.modeSwitchContainer}>
          <SwitchSelector
            options={options}
            initial={workoutMode === "strength" ? 0 : 1}
            onPress={value => changeWorkoutMode(value)}
            textColor={Colors.primary}
            selectedColor={Colors.white}
            buttonColor={Colors.primary}
            borderColor={Colors.primary}
          />
        </View>

        {workoutMode == 'strength' && (
          <View style={styles.routineListContainer}>
            {loading == true && (
              <View style={[styles.center, styles.fillSpace]}>
                <Wander size={120} color={Colors.primary} />
              </View>
            )}
            {loading == false && routineList && routineList.length > 0 && (
              <Carousel
                data={routineList}
                firstItem={routineSelectedID.current}
                activeSlideOffset={5}
                lockScrollTimeoutDuration={2000}
                renderItem={renderSlide}
                sliderWidth={width - 40}
                itemWidth={slideWidth}
                layout={'stack'} 
                layoutCardOffset={5}
                onSnapToItem={handleSnapToItem}
              />
            )}
            {routineList.length == 0 && loading == false && (
              <View style={styles.center}>
                <Text>You have no routines...</Text>
              </View>
            )}
          </View>
        )}

        {workoutMode == 'cardio' && (
          <View style={[styles.homeContainer, styles.marginTop_S, styles.fillSpace]}>
            <View style={[styles.marginTop_M]}>

            {loading == true && (
              <View style={[styles.center, styles.marginTop_M]}>
                <Wander size={120} color={Colors.primary} />
              </View>
            )}

            {workoutList.length == 0 && loading == false && (
              <View style={styles.center}>
                <Text>You have no cardio workouts...</Text>
              </View>
            )}
            {workoutList.length != 0 && loading == false && (
              <ScrollView >
                {workoutList.map((workout, index) => (
                  <CardioWorkoutRecord key={index} workout={workout} />
                ))}
              </ScrollView>   
            )}

            </View>
          </View>
        )}

        <Pressable 
          onPress={() => { setPageMode('Workout') }}
          style={ selectedWorkouts.length == 0 ? [styles.startWorkoutButton, styles.disabled] : styles.startWorkoutButton }
          disabled={selectedWorkouts.length == 0}
        >
          <Text>Start Workout</Text>
        </Pressable>
      </>
    )
  }

  return (
    <>
      <View style={[styles.background, styles.fillSpace]}>
        {pageMode == 'Main' && (
          <Main></Main>
        )}
        {pageMode == 'Edit' && (
          <EditWorkout 
            workoutMode={workoutMode} 
            navigation={navigation}
          ></EditWorkout>
        )}
        {pageMode == 'Workout' && (
          <>
            {workoutMode == 'strength' && (
              <StrengthWorkout
                navigation={navigation}
                setPageMode={setPageMode}
                workouts={selectedWorkouts}
                routineID={routineSelected.current.id}
              ></StrengthWorkout>
            )}
            {workoutMode == 'cardio' && (
              <CardioWorkout
                navigation={navigation}
                setPageMode={setPageMode}
                workout={selectedWorkouts[0]}
              ></CardioWorkout>
            )}
          </>
        )}
      </View>
    </>
  );
}