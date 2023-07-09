import { Text, View, StyleSheet, Pressable } from "react-native"
import * as Colors from '../../config/colors'

export const StrengthWorkout = ({ navigation, setPageMode, workouts }) => {

  const Record = ({ item }) => {
    return (
      <View style={[styles.homeContainer]}>
        <Text style={styles.title}>{item.name}</Text>

        <View style={[styles.center]}>
          <Text style={styles.text}>Set 1</Text>
        </View>

      </View>
    );
  };

  return (
    <>
      <View style={styles.fillSpace}>
        {workouts.map((item, index) => (
          <Record key={index} item={item} />
        ))}
        <Pressable
          style={styles.button}
        >
          <Text style={styles.text}>Add Activity</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  fillSpace: {
    flex: 1,
  },
  homeContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    marginHorizontal: 20,
    borderColor: Colors.primary,
  },
  title: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 20,
  },
})