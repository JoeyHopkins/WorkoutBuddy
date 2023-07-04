import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.getAllCardioWorkouts = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM cardioWorkouts",
        null,
        (txObj, { rows: { _array } }) => { 
          resolve(_array)
        },
        (txObj, error) => { reject(error) },
      );
    });
  });
};