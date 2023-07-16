import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native"
import * as Colors from '../../config/colors'
import BottomSheet from 'react-native-simple-bottom-sheet';
import { useEffect, useRef, useState } from "react";
import { showMessage } from "react-native-flash-message";
import * as workoutSql from '../../controllers/workouts.controller'
import styles from '../../config/styles';

export const StrengthWorkout = ({ navigation, setPageMode, workouts }) => {

  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const [activityList, setActivityList] = useState([]);

  useEffect(() => {
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
    fetchData()
  }, [])

  async function getData() {
    try {
      let activityList = await workoutSql.getAllStrengthWorkouts()
      setActivityList(activityList)
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

  const Record = ({ item }) => {
    return (
      <View style={[styles.homeContainer, styles. marginTop_S]}>
        <Text style={styles.title}>{item.name}</Text>

        <View style={[styles.center]}>
          <Text>Set 1</Text>
        </View>

        <Pressable
          style={styles.button}
        >
          <Text>Add Set</Text>
        </Pressable>

      </View>
    );
  };

  const WorkoutsRecord = ({activity }) => {
    return (
      <>
        <Text>{activity.name}</Text>
      </>
    )
  }

  const BottomDrawer = () => {
    return (
      <View>
        <Pressable
          style={styles.button}
        >
          <Text>Add New Activity</Text>
        </Pressable>

        <ScrollView>
          {activityList.map((activity, index) => (
            <WorkoutsRecord key={index} activity={activity} />
          ))}
        </ScrollView>
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