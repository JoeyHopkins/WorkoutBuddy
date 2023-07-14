import { Text, View, StyleSheet, Pressable } from "react-native"
import * as Colors from '../../config/colors'
import BottomSheet from 'react-native-simple-bottom-sheet';
import { useRef } from "react";

export const StrengthWorkout = ({ navigation, setPageMode, workouts }) => {

  const panelRef = useRef(null);

  const Record = ({ item }) => {
    return (
      <View style={[styles.homeContainer]}>
        <Text style={styles.title}>{item.name}</Text>

        <View style={[styles.center]}>
          <Text style={styles.text}>Set 1</Text>
        </View>

        <Pressable
          style={styles.button}
        >
          <Text style={styles.text}>Add Set</Text>
        </Pressable>

      </View>
    );
  };

  const BottomDrawer = () => {
    return (
      <View>
        <Pressable
          style={styles.button}
        >
          <Text style={styles.text}>Add New Activity</Text>
        </Pressable>
        <Text>
          List placeholder
        </Text>
      </View>
    )
  }

  return (
    <>
      <View style={styles.fillSpace}>
        {workouts.map((item, index) => (
          <Record key={index} item={item} />
        ))}
        <Pressable
          style={styles.button}
        >
          <Text 
            style={styles.text}
            onPress={() => panelRef.current.togglePanel()}
          >Add Activity</Text>
        </Pressable>
      </View>
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