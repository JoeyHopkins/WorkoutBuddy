import React, {useRef, useState} from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Button, Pressable} from 'react-native';
import * as Colors from '../../config/colors'

const width = Dimensions.get('window').width

export const Home = ({navigation}) => {

  const [routineList, setRoutineList] = useState([]);

  return (
    <>
      <ScrollView style={styles.background}>
        
        <View style={styles.homeContainer}>
          <Text style={styles.homeContainerTitle}>You have no Routines...</Text>

          <Pressable 
            style={styles.button} 
            onPress={() => { console.log('hit') }}
          >
            <Text>Create Routine</Text>
          </Pressable>

        </View>

        <View style={styles.homeContainer}>
          <Text style={styles.homeContainerTitle}>Progress</Text>
        </View>

        <View style={styles.homeContainer}>
          {routineList.length > 0 ? (
            <Text>Render the Reports screen here</Text>

            ) : (
            <Text>You have no Routines...</Text>
          )}
        </View>

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 20,
    padding: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    borderColor: Colors.primary
  },
  homeContainerTitle: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  background: {
    backgroundColor: Colors.background,
  },
  button: {
    width: 150,
    height: 30,
    // padding: 30,
    // borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center', 
  }
});