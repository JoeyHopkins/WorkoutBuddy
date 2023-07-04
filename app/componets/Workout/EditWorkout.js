import { StyleSheet, Text, View, Button, Dimensions, Pressable} from 'react-native';
import * as Colors from '../../config/colors'
import EntyoIcon from 'react-native-vector-icons/Entypo';

export function EditWorkout({workoutMode, setPageMode, routineSelected}) {

  let editRoutine = ''

  if(workoutMode === 'cardio')
    editRoutine = 'Cardio'
  else
    editRoutine = routineSelected.current.routine
  
  return (
    <> 
      <View style={styles.centerTitle}>
        <Text style={styles.title}>{editRoutine} Workouts</Text>
      </View>

      <View style={styles.homeContainer}>
      </View>
      
      <View style={styles.center}>
        <Pressable 
          style={styles.circleButton}
          onPress={() => { setPageMode('Main') }}
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