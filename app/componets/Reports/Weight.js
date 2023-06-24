import { View, Text, Pressable, StyleSheet, FlatList, Dimensions} from 'react-native';
import React, { useState, useEffect } from 'react';
import reportsSql from '../../controllers/reports.controller'
import { LineChart } from '../../graphHelper/LineChart'
import Utils from '../../utils'
import { showMessage } from "react-native-flash-message";
import BottomSheet from 'react-native-simple-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EntyoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import InputSpinner from "react-native-input-spinner";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as Colors from '../../config/colors'


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const graphDimensions = {
  height: 3 * height / 5,
  width: width,
  margin: 20,
};

exports.getReport = () => {
  let date = new Date()
  const [datePicked, setDatePicked] = useState(date.toLocaleDateString());
  const [weightPicked, setWeightPicked] = useState(5);

  const [weightList, setWeightList] = useState([]);
  const [goalWeightList, setGoalWeightList] = useState([]);
  const [showGoals, setShowGoals] = useState(true);
  const [tableMode, setTableMode] = useState('Weight');
  const [actionMode, setActionMode] = useState('read');
  const [addIcon, setAddIcon] = useState('add-to-list');
  
  const [editID, setEditID] = useState(-1);

  const [quickDateMode, setQuickDateMode] = useState('1W');

  const showDatePicker = () => {
    //set timezone to help prevent issues with timezone
    let d = new Date(datePicked);
    d.setUTCHours(6);

    DateTimePickerAndroid.open({
      value: d,
      onChange,
      display: 'spinner',
      mode: 'date',
      is24Hour: true,
    });
  };

  const onChange = (event, selectedDate) => {
    setDatePicked(selectedDate.toISOString());
  };
  
  function toggleWeightGoal() {
    if(tableMode == 'Weight') {
      setTableMode('Goal')
      styles.circleButton.backgroundColor = Colors.secondary
    }
    if(tableMode == 'Goal') {
      setTableMode('Weight')
      styles.circleButton.backgroundColor = Colors.primary
    }
    
    setAddIcon('add-to-list')
    setActionMode('read')
  };

  function addRecordSetup() {
    if(addIcon == 'add-to-list') {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const currentDateISOString = currentDate.toISOString();

      setAddIcon('cross')

      setDatePicked(currentDateISOString)
      setWeightPicked(0)

      if(tableMode == 'Weight' && weightList.length != 0) {
        setDatePicked(weightList[0].date)
        setWeightPicked(weightList[0].weight)
      }
      if(tableMode == 'Goal' && goalWeightList.length != 0) {
        setDatePicked(goalWeightList[0].date)
        setWeightPicked(goalWeightList[0].weight)
      }
      
      setActionMode('add')
    }
    else {
      setAddIcon('add-to-list')
      setActionMode('read')
    }
  };
  
  function editRecordSetup(id, weight, dateInput) {
    setDatePicked(dateInput)
    setWeightPicked(weight)
    setEditID(id)
    setAddIcon('cross')
    setActionMode('edit')
  };
    
  function deleteWeight(id) {
    reportsSql.deleteWeightByID(id, tableMode)
    showMessage({
      message: "Success!",
      description: "Record was deleted!",
      type: "success",
    });
    reportsSql.getAllWeight(setWeightList, setGoalWeightList)
  };
  
  function submitWeight(actionType) {
    if(actionType == 'add') {
      let formattedDate = datePicked.substring(0, 10)
      reportsSql.submitNewWeight(weightPicked, formattedDate, tableMode)
      reportsSql.getAllWeight(setWeightList, setGoalWeightList)
      addRecordSetup()
    }
    else {
      let formattedDate = datePicked.substring(0,10)
      reportsSql.editWeightByID(editID, weightPicked, formattedDate, tableMode)
      reportsSql.getAllWeight(setWeightList, setGoalWeightList)
      addRecordSetup()
    }
  }
  
  function getEarliestDateByMode() {
    const currentDate = new Date();
    currentDate.setHours(6);

    switch (quickDateMode) {
      case '6M':
        currentDate.setMonth(currentDate.getMonth() - 6);
        break;
      case '1M':
        currentDate.setMonth(currentDate.getMonth() - 1);
        break;
      case '2W':
        currentDate.setDate(currentDate.getDate() - 14);
        break;
      case '1W':
        currentDate.setDate(currentDate.getDate() - 7);
        break;
      case 'All':
        return null
        break;
      default:
        break;
    }

    return currentDate.toISOString().split('T')[0];
  }

  function setQuickDateForPage(mode){
    setQuickDateMode(mode)
  }

  useEffect( () => {
    reportsSql.getAllWeight(setWeightList, setGoalWeightList)
  }, [])
  
  function RenderGraph() { 

    let earliestDate = getEarliestDateByMode()
    let graphData = [weightList]

    if(showGoals)
      graphData.push(goalWeightList)
    
    if(weightList.length == 0)
      return(
        <Text style={{textAlign: 'center', marginTop: 100}}>No Data...</Text>
      )
    else
    return (
      <LineChart
        earliestDate={earliestDate}
        tableData={graphData}
        dimensions={graphDimensions}
      ></LineChart>
      )
  }

  function BottomDrawer() {
    return (
      <View style={styles.listBackground}>

        {/* Top two circle buttons on bottom sheet*/}
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
            <EntyoIcon name={addIcon} size={20} color={Colors.black} />
          </Pressable>
        </View>
          
        {actionMode === 'read' &&  (
          <>
            {tableMode === 'Weight' &&  (
              <>
                {/* if weight data exists */}
                {weightList.length > 0 &&  (
                  <>
                    <FlatList
                      data={weightList}
                      renderItem={({item}) => <Weightrecord id={item.id} weight={item.weight} date={new Date(item.date)}/>}
                      keyExtractor={item => item.id}
                    />
                  </>
                )}
                {/* else read data does not exist */}
                {weightList.length == 0 &&  (
                  <>
                    <Text style={{textAlign: 'center', marginTop: 20, marginBottom: -40}}>No Data Available</Text>
                  </>
                )}
              </>
            )}

            {tableMode === 'Goal' &&  (
              <>
                {/* if weight data exists */}
                {goalWeightList.length > 0 &&  (
                  <>
                    <FlatList
                      data={goalWeightList}
                      renderItem={({item}) => <Weightrecord id={item.id} weight={item.weight} date={new Date(item.date)}/>}
                      keyExtractor={item => item.id}
                    />
                  </>
                )}
                {/* else read data does not exist */}
                {goalWeightList.length == 0 &&  (
                  <>
                    <Text style={{textAlign: 'center', marginTop: 20, marginBottom: -40}}>No Data Available</Text>
                  </>
                )}
              </>
            )}
          </>
        )}

        {(actionMode === 'edit') && (
          <AddOrEditMenu action={actionMode}></AddOrEditMenu>
        )}

        {actionMode === 'add' && (
          <AddOrEditMenu action={actionMode}></AddOrEditMenu>
        )}

          <View style={styles.belowBottomSheetTable}></View>

      </View>
    )
  }

  const Weightrecord = ({id, weight, date}) => (
    <Pressable 
      style={styles.Weightrecord}
      onLongPress={() => { 
        editRecordSetup(id, weight, date.toISOString())
      }}
    >
      <Text>
        {Utils.formatISOtoDisplayDate(date)} 
      </Text>

      <Text style={{ marginLeft: -30 }}>
        {weight} lbs
      </Text>

      <Pressable
        onPress={() => { deleteWeight(id) }}
        style={{ marginRight: 30 }}
      >
        <Icon name="trash" size={20} color={Colors.highlight} />
      </Pressable>
    </Pressable>
  );

  const AddOrEditMenu = (item) => {

    let action = item.action
    
    let color
    let altColor

    if(tableMode == 'Weight')
    {
      color = Colors.primary
      altColor = Colors.altPrimary
    }
    if(tableMode == 'Goal')
    {
      color = Colors.secondary
      altColor = Colors.altSecondary
    }
    return (
      <View style={styles.addEditDrawerSection}>
        <Text style={styles.dateText} onPress={showDatePicker}>
          {Utils.formatISOtoDisplayDate(new Date(datePicked))}
        </Text>

        <View style={styles.inputSpinnerContainer}>
          <InputSpinner
            value={weightPicked} 
            style={styles.inputSpinner} 
            delayPressIn={100}
            type={"real"}
            step={0.1}
            textColor={Colors.black}
            color={altColor}
            background={color}
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
            onPress={() => { submitWeight(action) }}
          >
            <MaterialIcon name='check-outline' size={20} color={Colors.black} />
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        <RenderGraph></RenderGraph>
      </View>

      <View style={styles.underGraphContainerChecks}>
        <BouncyCheckbox
          size={25}
          isChecked
          fillColor={Colors.secondary}
          unfillColor={Colors.background}
          text="Show Goals"
          iconStyle={{ borderColor: Colors.secondary }}
          innerIconStyle={{ borderWidth: 2 }}
          textStyle={{
            textDecorationLine: 'none',
          }}
          onPress={() => setShowGoals(!showGoals)}        
        />
      </View>
      
      <View style={styles.underGraphContainerDates}>

        {/* <Pressable 
          style={quickDateMode == 'Pick' ? styles.graphDateButtonsActive : styles.graphDateButtons}
          onPress={() => { setQuickDateForPage('Pick') }}
        >
          <Text>Pick</Text>
        </Pressable> */}

        <Pressable 
          style={quickDateMode == 'All' ? styles.graphDateButtonsActive : styles.graphDateButtons}
          onPress={() => { setQuickDateForPage('All') }}
        >
          <Text>All</Text>
        </Pressable>

        <Pressable 
          style={quickDateMode == '6M' ? styles.graphDateButtonsActive : styles.graphDateButtons}
          onPress={() => { setQuickDateForPage('6M') }}
        >
          <Text>6M</Text>
        </Pressable>

        <Pressable 
          style={quickDateMode == '1M' ? styles.graphDateButtonsActive : styles.graphDateButtons}
          onPress={() => { setQuickDateForPage('1M') }}
        >
          <Text>1M</Text>
        </Pressable>

        <Pressable 
          style={quickDateMode == '2W' ? styles.graphDateButtonsActive : styles.graphDateButtons}
          onPress={() => { setQuickDateForPage('2W') }}
        >
          <Text>2W</Text>
        </Pressable>

        <Pressable 
          style={quickDateMode == '1W' ? styles.graphDateButtonsActive : styles.graphDateButtons}
          onPress={() => { setQuickDateForPage('1W') }}
        >
          <Text>1W</Text>
        </Pressable>

      </View>

      <BottomSheet isOpen={false}>
        <BottomDrawer></BottomDrawer>  
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  underGraphContainerDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    paddingTop: 30,
  },
  underGraphContainerChecks: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 30,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphContainer: {
    height: graphDimensions.height,
    marginTop: -20
  },
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'column',
  },
  listBackground: {
    backgroundColor: Colors.backgroundGray,
    paddingBottom: 90
  },
  dateText: {
    flex: 1,
    backgroundColor: Colors.white,
    textAlign: 'center',
    color: 'blue',
    paddingBottom: 20
  },
  Weightrecord: {
    backgroundColor: Colors.white,
    padding: 20,
    marginTop: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomDrawerButtonsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 90,
    paddingBottom: 30,
    backgroundColor: Colors.white,
  },
  bottomDrawerSubmitButtonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30
  },
  graphDateButtons: {
    width: 40,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphDateButtonsActive: {
    width: 40,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.white,
    paddingBottom: 20
  },
  belowBottomSheetTable: {
    backgroundColor: Colors.white,
    paddingBottom: 500
  }
});