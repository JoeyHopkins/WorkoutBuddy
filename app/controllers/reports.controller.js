import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.getReportList = (setReportList) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM reports",
        null,
        (txObj, { rows: { _array } }) => { 

          //if reports exist then load them into the list
          //else first time on app, create new record for weight
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

exports.submitNewWeight = (weight, date) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("INSERT INTO weight (weight, date) VALUES (?,?)",
        [weight, date],
        null,
        (txObj, ResultSet) => { 
          console.log('sucess')
          console.log(txObj)
          
          console.log(ResultSet) 
        },
        (txObj, error) => { console.log('Error ', error) },
      );
    });
  });
};

exports.getAllWeight = (setWeightList) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM weight",
        null,
        (txObj, { rows: { _array } }) => { setWeightList(_array) },
        (txObj, error) => { console.log('Error ', error) },
      );
    });
  });
};

exports.deleteWeightByID = (id) => {
  console.log('delete id')
  console.log(id)
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("DELETE FROM weight WHERE id = ?", [id],
        (txObj, ResultSet) => { console.log('sucess') },
        (txObj, error) => { console.log('Error ', error) },
      );
    });
  });
};

