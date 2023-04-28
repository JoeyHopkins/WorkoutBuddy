import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');
    
exports.getReportList = (setReportList) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM reports",
        null,
        (txObj, { rows: { _array } }) => { 

          //if reports exist then load them into the list
          if(_array.length > 0)
            setReportList(_array) 
          else
          {
            tx.executeSql("INSERT INTO reports (name) VALUES ('Weight'); SELECT * FROM reports",
              null,
              (txObj, { rows: { _array2 } }) => { setReportList(_array2) },
              (txObj, error) => { console.log('Error ', error) },
            );
          }
        },
        (txObj, error) => { console.log('Error ', error) },
      );
    });
  });
};