import { StyleSheet } from 'react-native';
import * as Colors from './colors';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 20,
    paddingTop: 20,
    marginHorizontal: 20,
    borderColor: Colors.primary,
    overflow: 'hidden',
    flex: 1,
  },
  addWorkoutContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  switchText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: -10,
    color: Colors.primary,
  },
  switchContainer: {
    marginBottom: -15,
    borderColor: Colors.primary,
    marginLeft: 20,
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillSpace: {
    flex: 1,
  },
  checkboxWithText: {
    marginBottom: -10,
  },
  checkboxText: {
    textAlign: 'center',
    fontSize: 10,
    color: Colors.backgroundGray,
  },
  workoutRecordContainer: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginHorizontal: -30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    marginTop: 1,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  row: {
    flexDirection: 'row',
  },
  marginBottom: {
    marginBottom: 10,
  },
  marginLeft: {
    marginLeft: 20,
  },
  listItemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  drawerContainer: {
    marginHorizontal: -21,
  },
  marginHorizonal: {
    marginHorizontal: 10,
  },
});

export default styles;