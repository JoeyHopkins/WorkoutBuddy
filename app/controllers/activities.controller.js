import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.getAllActivities = (setRoutineList) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM activities",
        null,
        (txObj, { rows: { _array } }) => { 
          resolve(_array)
        },
        (txObj, error) => { reject(error) },
      );
    });
  });
};

exports.addCustomActivity = (activity, date) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO activities (date, activity) VALUES (?, ?)",
        [date, activity],
        (txObj, res) => {
          resolve(res);
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};