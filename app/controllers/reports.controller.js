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

exports.submitNewWeight = (weight, date, tableMode) => {
  let table = ''

  if(tableMode == 'Weight')
    table = 'weight'
  if(tableMode == 'Goal')
    table = 'weight_goals'

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("INSERT INTO " + table + " (weight, date) VALUES (?,?)",
        [weight, date],
        null,
        (txObj, ResultSet) => { 
          console.log('sucess')
          resolve();
        },
        (txObj, error) => { 
          console.log('Error ', error) 
          reject(error);
        },
      );
    });
  });
};

exports.editWeightByID = (id, weight, date, tableMode) => {
  let table = ''

  if(tableMode == 'Weight')
    table = 'weight'
  if(tableMode == 'Goal')
    table = 'weight_goals'

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE " + table + " SET weight = ?, date = ? WHERE id = ?",
        [weight, date, id],
        (txObj, ResultSet) => {
          console.log('Update success');
          resolve();
        },
        (txObj, error) => {
          console.log('Error:', error);
          reject(error);
        },
      );
    });
  });
};

exports.getAllWeight = (setWeightList, setGoalWeightList) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM weight ORDER BY date desc, id desc",
        null,
        (txObj, { rows: { _array } }) => { setWeightList(_array) },
        (txObj, error) => { console.log('Error ', error) },
      );
    });
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM weight_goals ORDER BY date desc, id desc",
        null,
        (txObj, { rows: { _array } }) => { setGoalWeightList(_array) },
        (txObj, error) => { console.log('Error ', error) },
      );
    });
  });
};

exports.deleteWeightByID = (id, tableMode) => {

  let table = ''

  if(tableMode == 'Weight')
    table = 'weight'
  if(tableMode == 'Goal')
    table = 'weight_goals'

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("DELETE FROM " + table + " WHERE id = ?", [id],
        (txObj, ResultSet) => { console.log('sucess') },
        (txObj, error) => { console.log('Error ', error) },
      );
    });
  });
};

