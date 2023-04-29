import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.getTablesFromDB = () => {
  db.transaction(tx => {
    // sending 4 arguments in executeSql
    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", null, 
      // success callback which sends two things Transaction object and ResultSet Object
      (txObj, { rows: { _array } }) => console.log(_array),
      // failure callback which sends two things Transaction object and Error
      (txObj, error) => console.log('Error ', error)
      ) // end executeSQL
  }) // end transaction
};

exports.createTables = () => {
  db.transaction(txn => {
    txn.executeSql(`CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20));`,
      [],
      (sqlTxn, res) => {
        console.log("reports table created successfully")
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS weight (id INTEGER PRIMARY KEY AUTOINCREMENT, weight VARCHAR(20), date VARCHAR(10));`,
      [],
      (sqlTxn, res) => {
        console.log("weight table created successfully")
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
  });
};