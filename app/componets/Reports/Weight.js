import { View, Text, TextInput, Pressable, Button, StyleSheet, Keyboard, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import reportsSql from '../../controllers/reports.controller'
import { LineChart } from '../../graphHelper/LineChart'
import Utils from '../../utils'
import { showMessage, hideMessage } from "react-native-flash-message";
import BottomSheet from 'react-native-simple-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EntyoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import InputSpinner from "react-native-input-spinner";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

exports.getReport = () => {
  let date = new Date()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePicked, setDatePicked] = useState(date.toLocaleDateString());
  const [weightPicked, setWeightPicked] = useState(5);

  const [weightList, setWeightList] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteButtonText, setDeleteButtonText] = useState('Delete A Record');
  const [tableMode, setTableMode] = useState('Weight');
  const [actionMode, setActionMode] = useState('read');
  const [addIcon, setAddIcon] = useState('add-to-list');

  const [viewDatePicker, setViewDatePicker] = useState(false);
  const [mode, setMode] = useState('date');

  const onChange = (event, selectedDate) => {
    setViewDatePicker(false);
    setDatePicked(selectedDate.toLocaleDateString());
  };

  const showDatePicker = () => {
    let d = new Date()

    DateTimePickerAndroid.open({
      value: d,
      onChange,
      display: 'spinner',
      mode: 'date',
      is24Hour: true,
    });
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDatePicked(date.toLocaleDateString())
    hideDatePicker();
  };

  function deleteWeight(id) {
    reportsSql.deleteWeightByID(id)
    showMessage({
      message: "Success!",
      description: "Record was deleted!",
      type: "success",
    });
    reportsSql.getAllWeight(setWeightList)
  };

  const DeleteWeightView = ({id, weight, date}) => (
    <Pressable 
    style={styles.DeleteWeightView}
    onLongPress={() => { 
        editRecordSetup(id, weight, date.toISOString()) 
      }}
    >
      <Text>
        {date.toISOString()} 
      </Text>

      <Text style={{ marginLeft: -30 }}>
        {weight} lbs
      </Text>

      <Pressable
        onPress={() => { deleteWeight(id) }}
        style={{ marginRight: 30 }}
      >
        <Icon name="trash" size={20} color="#ff5124" />
      </Pressable>
    </Pressable>
  );
  
  function toggleWeightGoal() {
    if(tableMode == 'Weight')
    {
      setTableMode('Goal')
      styles.circleButton.backgroundColor = '#ffe84f'
    }
    if(tableMode == 'Goal')
    {
      setTableMode('Weight')
      styles.circleButton.backgroundColor = '#58dcff'
    }
    
    setAddIcon('add-to-list')
    setActionMode('read')
  };

  function addRecordSetup() {
    if(addIcon == 'add-to-list') {
      setAddIcon('cross')
      setActionMode('add')
    }
    else {
      setAddIcon('add-to-list')
      setActionMode('read')
    }
  };

  function editRecordSetup(id, weight, dateInput) {
    setDatePicked(dateInput)
    setAddIcon('cross')
    setActionMode('edit')
  };


  function submitWeight(actionType) {
    if(actionType == 'add') {
      let formattedDate = Utils.convertDateFormat(datePicked)
      reportsSql.submitNewWeight(weightPicked, formattedDate)
      reportsSql.getAllWeight(setWeightList)
    }
  }

  function BottomDrawer(showDelete) {

    // if(showDelete.show)
    return (
      <View style={styles.listBackground}>

          <View style={styles.bottomDrawerButtonsView}>
            <Pressable 
              style={styles.circleButton} 
              onPress={() => { toggleWeightGoal() }}
            >
              <Text>{tableMode}</Text>
            </Pressable>
    
            <Pressable 
              style={styles.circleButton}
              onPress={() => { addRecordSetup() }}
            >
              <EntyoIcon name={addIcon} size={20} color="#000000" />
            </Pressable>

          </View>

          {actionMode === 'read' && (
            <>
              {console.log('reading')}
              <FlatList
                data={weightList}
                renderItem={({item}) => <DeleteWeightView id={item.id} weight={item.weight} date={new Date(item.date)}/>}
                keyExtractor={item => item.id}
              />
            </>
          )}


          {actionMode === 'edit' && (
            <Text>Edit Mode</Text>
          )}

 
          {actionMode === 'add' && (
            <View style={styles.addEditDrawerSection}>
              <Text style={styles.dateText} onPress={showDatePicker}>
                {datePicked}
              </Text>

              <View style={styles.inputSpinnerContainer}>
                <InputSpinner
                  value={weightPicked} 
                  style={styles.inputSpinner} 
                  delayPressIn={100}
                  type={"real"}
                  step={0.1}
                  textColor={"#FFF"}
                  color={"#2d6bff"}
                  background={"#58dcff"}
                  rounded={false}
                  showBorder
                  onChange={(num) => {
                    setWeightPicked(num);
                  }}
                />
              </View>

              <View style={styles.bottomDrawerSubmitButtonView}>

                <Pressable 
                  style={styles.circleButton}
                  onPress={() => { submitWeight('add') }}
                >
                  <MaterialIcon name='check-outline' size={20} color="#000000" />
                </Pressable>
              </View>
            </View>
          )}

        </View>
      )
    // else
    //   return (
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
    flex: 1,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    color: 'blue',
    paddingBottom: 20
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
  bottomDrawerButtonsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 90,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
  },
  bottomDrawerSubmitButtonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#58dcff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputSpinner: {
    flex: 1,
    minWidth: 250,
    maxWidth: 250,
  },
  inputSpinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEditDrawerSection: {
    backgroundColor: '#ffffff',
    paddingBottom: 20
  }
});