import { View, Text, TextInput, Button, StyleSheet, Keyboard, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import reportsSql from '../../controllers/reports.controller'
import { LineChart } from '../../graphHelper/LineChart'

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
    reportsSql.submitNewWeight(weightPicked, datePicked)
    reportsSql.getAllWeight(setWeightList)
    Keyboard.dismiss()
  }

  function deleteWeight(id) {
    reportsSql.deleteWeightByID(id)
    reportsSql.getAllWeight(setWeightList)
  }

  const DeleteWeightView = ({id, weight, date}) => (
    <View style={styles.DeleteWeightView}>
      <Text>
        {date.toLocaleDateString()}: {weight}
        <Text 
          onPress={ () => deleteWeight(id) } 
          style={styles.setDateText}
        > Delete</Text>
      </Text>
    </View>
  );

  function WeightOrDelete(showDelete) {
    if(showDelete.show)
      return (
        <View>
          <Text>Show Delete</Text>
          <FlatList
            data={weightList}
            renderItem={({item}) => <DeleteWeightView id={item.id} weight={item.weight} date={date}/>}
            keyExtractor={item => item.id}
          />
        </View>
      )
    else
      return (
        <View>
          <Text style={styles.dateText}>
            {datePicked}
            <Text onPress={showDatePicker} style={styles.setDateText}> Set</Text>
          </Text>
  
          <TextInput
            inputMode="numeric"
            style={styles.input}
            placeholder="Weight"
            onChangeText={setWeightPicked}
            value={weightPicked}
            ></TextInput>
  
          <Button
            title="Submit"
            onPress={() => {
              submitNewWeight()
            }}
          />
        </View>
      )
  }

  useEffect( () => {
    reportsSql.getAllWeight(setWeightList)
  }, [])

  function RenderTable() { 
      return (
        <LineChart style={styles.table}></LineChart>
      )
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <RenderTable show={!showDelete}></RenderTable>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Button
        title={deleteButtonText}
        style={styles.editButton}
        onPress={() => {
          setShowDelete(!showDelete)
          if(deleteButtonText == 'Delete A Record')
            setDeleteButtonText('Cancel')
            else
            setDeleteButtonText('Delete A Record')
        }}
      />
      <WeightOrDelete show={showDelete}></WeightOrDelete>
    </View>

      



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
  setDateText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});