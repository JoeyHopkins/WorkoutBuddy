import { StyleSheet, Text, View, Button, Dimensions, Pressable} from 'react-native';
import * as Colors from '../../config/colors'
import EntyoIcon from 'react-native-vector-icons/Entypo';

export function EditWorkout({setPageMode, routineSelected}) {

  let editRoutine = (routineSelected.current)
  return (
    <> 
      <View style={styles.homeContainer}>
        <View style={styles.center}>
          <Text style={styles.title}>{editRoutine.routine} Workouts</Text>
        </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});