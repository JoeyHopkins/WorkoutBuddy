import { View, Text, TextInput, Pressable, Button, StyleSheet, Keyboard, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import reportsSql from '../../controllers/reports.controller'
import { LineChart } from '../../graphHelper/LineChart'
import Utils from '../../utils'
import { showMessage, hideMessage } from "react-native-flash-message";
import BottomSheet from 'react-native-simple-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome5';

exports.getReport = () => {
  let date = new Date()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePicked, setDatePicked] = useState(date.toLocaleDateString());
  const [weightPicked, setWeightPicked] = useState('');
  const [weightList, setWeightList] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteButtonText, setDeleteButtonText] = useState('Delete A Record');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDatePicked(date.toLocaleDateString())
    hideDatePicker();
  };

  function submitNewWeight() {
    let formattedDate = Utils.convertDateFormat(datePicked)
    reportsSql.submitNewWeight(weightPicked, formattedDate)
    reportsSql.getAllWeight(setWeightList)
  }

  function deleteWeight(id) {
    reportsSql.deleteWeightByID(id)
    showMessage({
      message: "Success!",
      description: "Record was deleted!",
      type: "success",
    });
    reportsSql.getAllWeight(setWeightList)
  }

  const DeleteWeightView = ({id, weight, date}) => (
    <Pressable 
      style={styles.DeleteWeightView}
      onLongPress={() => { console.log('fire edit')}}
    >
      <Text>
        {date.toLocaleDateString()} 
      </Text>
      <Text style={{ marginLeft: -30 }}>
        {weight} lbs
      </Text>

      <Pressable
        onPress={() => { console.log('fire delete')}}
        style={{ marginRight: 30 }}
      >
        <Icon name="trash" size={20} color="#ff5124" />
      </Pressable>
    </Pressable>
  );

  function BottomDrawer(showDelete) {
    // if(showDelete.show)
      return (
        <View style={styles.listBackground}>
          <FlatList
            data={weightList}
            renderItem={({item}) => <DeleteWeightView id={item.id} weight={item.weight} date={new Date(item.date)}/>}
            keyExtractor={item => item.id}
          />
        </View>
      )
    // else
    //   return (
    //     <View>
    //       <Text style={styles.dateText}>
    //         {datePicked}
    //         <Text onPress={showDatePicker} style={styles.setDateText}> Set</Text>
    //       </Text>
  
    //       <TextInput
    //         inputMode="numeric"
    //         style={styles.input}
    //         placeholder="Weight"
    //         onChangeText={setWeightPicked}
    //         value={weightPicked}
    //         ></TextInput>
  
    //       <Button
    //         title="Submit"
    //         onPress={() => {
    //           submitNewWeight()
    //         }}
    //       />
    //     </View>
    //   )
  }

  useEffect( () => {
    reportsSql.getAllWeight(setWeightList)
  }, [])

  function RenderTable() { 

    const dimensions = {
      height: 400,
      width: 350,
      margin: 30,
    };
    
    // let testWeightList = [
    //   {"date": "2023-06-01", "id": 1, "weight": 10}, 
    //   {"date": "2023-06-04", "id": 2, "weight": 25},
    //   {"date": "2023-06-07", "id": 3, "weight": 15},
    //   {"date": "2023-06-09", "id": 4, "weight": 30},
    // ]
 
    if(weightList.length == 0)
      return(<Text>Loading...</Text>)
    else
      return (
        <LineChart
          tableData={weightList}
          dimensions={dimensions}
        ></LineChart>
      )

  }

  return (
    <View style={styles.container}>

      {!showDelete
        ? 
          <View style={styles.section}>
            <RenderTable></RenderTable>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              />
          </View>
        :
        <View>
        </View>
      }

      <Button
        title={deleteButtonText}
        style={styles.editButton}
        onPress={() => {
          setShowDelete(!showDelete)
          if(deleteButtonText == 'Delete A Record')
            setDeleteButtonText('Cancel')
          else
            setDeleteButtonText('Delete A Record')
          }
        }
      />

      <BottomSheet isOpen={true}>
        <View>
          <BottomDrawer show={showDelete}></BottomDrawer>  
        </View>
      </BottomSheet>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  listBackground: {
    backgroundColor: '#f0f0f0',
  },
  section: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  dateText: {
    marginLeft: 12,
  },
  editButton: {
    flex: 1
  },
  DeleteWeightView: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 1,  // Vertical margin from the top
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});