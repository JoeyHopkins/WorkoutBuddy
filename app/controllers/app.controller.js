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
    txn.executeSql(`CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, setting VARCHAR(20), config VARCHAR(50));`,
      [],
      (sqlTxn, res) => {
        console.log("settings table created successfully")
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20));`,
      [],
      (sqlTxn, res) => {
        console.log("reports table created successfully")
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS weight (id INTEGER PRIMARY KEY AUTOINCREMENT, weight VARCHAR(20), date VARCHAR(24));`,
      [],
      (sqlTxn, res) => {
        console.log("weight table created successfully")
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS weight_goals (id INTEGER PRIMARY KEY AUTOINCREMENT, weight VARCHAR(20), date VARCHAR(24));`,
      [],
      (sqlTxn, res) => {
        console.log("goal table created successfully")
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS routines (id INTEGER PRIMARY KEY AUTOINCREMENT, dayNum INTEGER, routine VARCHAR(20));`,
      [],
      (sqlTxn, res) => {
        console.log("routines table created successfully")
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
  });
};

exports.dropAllTables = () => {
  
  db.transaction(tx => {
    // sending 4 arguments in executeSql
    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", null, 
      // success callback which sends two things Transaction object and ResultSet Object
      (txObj, { rows: { _array } }) => {
      
        _array.forEach(row => {
          const tableName = row.name;
          if(tableName =='sqlite_sequence')
            console.log('skipping')
          else {
            const dropQuery = `DROP TABLE ${tableName}`;
        
            txObj.executeSql(dropQuery, [], (_, result) => {
              console.log(`Table ${tableName} dropped successfully.`);
            },
            (_, error) => {
              console.error(`Error dropping table ${tableName}: ${error.message}`);
            });
          }
        });
      },

      // failure callback which sends two things Transaction object and Error
      (txObj, error) => console.log('Error ', error)
      ) // end executeSQL
  }) // end transaction
};