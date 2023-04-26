import React, {useRef, useState} from 'react';
import { Button, FlatList, DrawerLayoutAndroid, StyleSheet, View, } from 'react-native';

export const Reports = ({navigation}) => {
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState('right');
  
  const reportList = [
    {
      id: '1',
      title: 'Weight',
    },
    {
      id: '2',
      title: 'Second Item',
    },
    {
      id: '3',
      title: 'Third Item',
    },
  ];

  const navigationView = () => (
    <View style={[styles.containerReportList]}>
      <FlatList
        data={reportList}
        renderItem={({item}) => <ReportListView title={item.title} />}
        keyExtractor={item => item.id}
      />
    </View>
  );

  const ReportListView = ({title}) => (
    <View style={styles.reportListItem}>
      <Button
        title={title}
        onPress={() => drawer.current.closeDrawer()}
      />
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}>
      <View style={styles.container}>
        <Button
          title="Open drawer"
          onPress={() => drawer.current.openDrawer()}
        />
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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