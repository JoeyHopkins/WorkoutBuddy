import { StyleSheet } from 'react-native';
import * as Colors from './colors';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: width * 0.5,
    borderColor: Colors.primary,
    backgroundColor: "white",
    width: width * 0.9,
    maxHeight: width * 0.9,
  },
  timer: {
    fontSize: 48,
    textAlign: 'center',
  },
  distanceText: {
    marginTop: 5,
    marginLeft: 10,
  },
  button: {
    paddingVertical: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  smallButton: {
    width: width * 0.42,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  workoutRecord: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingVertical: 10,
  },
  routineListContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    marginHorizontal: 20,
    borderColor: Colors.primary,
    overflow: 'hidden',
    flex: 1,
    paddingTop: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  totalItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingBottom: 5,
  },
  modeSwitchContainer: {
    marginHorizontal: 20,
    paddingTop: 10,
  },
  slide: {
    flex: 1,
    borderWidth: 3,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  title: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textWhite: {
    color: Colors.white,
  },
  smallTitle: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  strengthWorkoutListContainer: {
    marginBottom: 20,
    borderRadius: 20,
    flex: 1,
  },
  startWorkoutButton: {
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  editButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 0,
  },
  headerButton: {
    marginLeft: 10,
    marginRight: -10,
  },
  leftBorder: {
    borderLeftColor: Colors.white,
    borderLeftWidth: 1,
  },
  headerEditButton: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
  },
  homeContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.primary,
    marginHorizontal: 20,
  },
  switchText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: -10,
    color: Colors.primary,
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
  marginBottom_L: {
    marginBottom: 100,
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
  marginHorizonal_S: {
    marginHorizontal: 10,
  },
  marginHorizonal_M: {
    marginHorizontal: 20,
  },
  marginHorizonal_L: {
    marginHorizontal: 40,
  },
  marginLeft: {
    marginLeft: 20,
  },
  marginRight: {
    marginRight: 20,
  },
  marginVertical_S: {
    marginVertical: 10,
  },
  marginVertical_M: {
    marginVertical: 20,
  },
  marginTop_S: {
    marginTop: 10,
  },
  marginTop_M: {
    marginTop: 20,
  },
  marginBottom_S: {
    marginBottom: 10,
  },
  marginBottom_M: {
    marginBottom: 20,
  },
  removeMarginBottom12: {
    marginBottom: -12,
  },
  paddingVertical_S: {
    paddingVertical: 10,
  },
  paddingVertical_M: {
    paddingVertical: 20,
  },
  paddingVertical_L: {
    paddingVertical: 30,
  },
  paddingHorizontal_S: {
    paddingHorizontal: 10,
  },
  paddingHorizontal_M: {
    paddingHorizontal: 20,
  },
  paddingHorizontal_L: {
    paddingHorizontal: 30,
  },
  border: {
    borderWidth: 1,
  },
  background: {
    backgroundColor: Colors.white,
  },
  disabled: {
    backgroundColor: Colors.backgroundGray,
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  buttonLow: {
    backgroundColor: Colors.green,
  },
  buttonMedium: {
    backgroundColor: Colors.yellow,
  },
  stopButton: {
    backgroundColor: Colors.red,
  },
  reverse: {
    justifyContent: 'flex-end',
  },
  spread: {
    justifyContent: "space-between",
  },
	spinner: {
    width: 100,
    height: 30,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: Colors.primary,
	},
  inputSpinnerButtonContainer: {
    width: 30,
  },
  addRoutineContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  routineContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  routineRecordContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 1,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
});

export default styles;