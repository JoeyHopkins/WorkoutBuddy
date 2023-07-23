import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.insertStrengthTotals = (id, date, reps, total) => {

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("INSERT INTO strengthTotals (workoutId, date, reps, total) VALUES (?, ?, ?, ?)",
        [id, date, reps, total],
        (txObj, ResultSet) => { resolve(ResultSet); },
        (txObj, error) => { reject(error); },
      );
    });
  });
};
