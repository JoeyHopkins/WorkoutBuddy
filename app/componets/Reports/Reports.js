import React, {useRef, useState} from 'react';
import { Button, FlatList, DrawerLayoutAndroid, StyleSheet, View, Text} from 'react-native';
import { useEffect } from 'react'
import reportsSql from '../../controllers/reports.controller'
import weightReport from './Weight'

export const Reports = ({navigation}) => {

  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState('right');
  const [titleText, setTitleText] = useState("");
  const [selectedReportID, setSelectedReportID] = useState("");
  const [reportList, setReportList] = useState([]);

  const navigationView = () => (
    <View style={[styles.containerReportList]}>
      <FlatList
        data={reportList}
        renderItem={({item}) => <ReportListView title={item.name} id={item.id} />}
        keyExtractor={item => item.id}
      />
    </View>
  );

  const ReportListView = ({title, id}) => (
    <View style={styles.reportListItem}>
      <Button
        title={title}
        onPress={() => {
          drawerReportSelected(title, id)
        }}
      />
    </View>
  );
  
  const drawerReportSelected = (title, id) => {
    setTitleText("Selected Report: " + title);
    setSelectedReportID(title)
    drawer.current.closeDrawer()
  };

  function RenderReportComponet(input) {
    switch(input.name)
    {
      case "Weight":
        return weightReport.getReport();
      default:
        return weightReport.getReport();
    }
  }

  useEffect( () => {
    reportsSql.getReportList(setReportList);
  }, [])

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <Text style={styles.titleText}>
        {titleText}
      </Text>

      <RenderReportComponet name={selectedReportID}></RenderReportComponet>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    padding: 16,
  },
  containerReportList: {
    flex: 1,
    justifyContent: 'center',
    padding: 0,
    backgroundColor: '#ecf0f1',
  },
  reportListItem: {
    backgroundColor: '#f9c2ff',
    marginVertical: 8,
    marginHorizontal: 0,
  },
});