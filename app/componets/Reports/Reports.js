import React, {useRef, useState} from 'react';
import { Button, FlatList, DrawerLayoutAndroid, StyleSheet, View, Text} from 'react-native';

const reportList = [
  {
    id: '0',
    title: 'Weight',
  },
  {
    id: '1',
    title: 'Second Item',
  },
  {
    id: '2',
    title: 'Third Item',
  },
];

export const Reports = ({navigation}) => {
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState('right');
  const [titleText, setTitleText] = useState("");

  const navigationView = () => (
    <View style={[styles.containerReportList]}>
      <FlatList
        data={reportList}
        renderItem={({item}) => <ReportListView title={item.title} id={item.id} />}
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

  const drawerReportSelected = (id) => {
    setTitleText("Selected Report: " + id);
  };

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