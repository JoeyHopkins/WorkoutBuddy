import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.getAllRoutines = (setRoutineList) => {
  setTimeout(() => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql("SELECT * FROM routines",
          null,
          (txObj, { rows: { _array } }) => { setRoutineList(_array) },
          (txObj, error) => { console.log('Error ', error) },
        );
      });
    });
  }, 2000);
};