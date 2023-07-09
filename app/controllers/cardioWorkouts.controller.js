import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.insertL1CardioWorkout = (workoutId, duration, intensity, date) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO cardioWorkoutsL1 (workoutId, duration, intensity, date) VALUES (?, ?, ?, ?)",
        [workoutId, duration, intensity, date],
        () => {
          resolve();
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

exports.insertL2CardioWorkout = (workoutId, duration, intensity, date, distance) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO cardioWorkoutsL2 (workoutId, duration, intensity, date, distance) VALUES (?, ?, ?, ?, ?)",
        [workoutId, duration, intensity, date],
        () => {
          resolve();
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};