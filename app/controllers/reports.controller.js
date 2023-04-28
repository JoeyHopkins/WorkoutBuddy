import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');
    
exports.getReports = (setReportList) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM reports",
        null,
        (txObj, { rows: { _array } }) => { setReportList(_array) },
        (txObj, error) => { console.log('Error ', error) },
      );
    });
  });
};