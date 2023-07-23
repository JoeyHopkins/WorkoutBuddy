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
      ) 
  })
};

// db.transaction(tx => {
//   tx.executeSql(
//     "ALTER TABLE routines ADD COLUMN type INTEGER DEFAULT 0",
//     [],
//     () => console.log("Column added successfully"),
//     (txObj, error) => console.log("Error ", error)
//   );
// });


exports.dropTable = (table) => {
  db.transaction(tx => {
    tx.executeSql(`DROP TABLE ` + table,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("table deleted successfully");
      },
      error => {
        console.log("error dropping table " + error.message)
      }
    )
  })
};

exports.createTables =  () => {

  db.transaction(txn => {
    txn.executeSql(`CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, setting VARCHAR(20), config VARCHAR(50));`,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("settings table created successfully");
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20));`,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("reports table created successfully");
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS weight (id INTEGER PRIMARY KEY AUTOINCREMENT, weight VARCHAR(20), date VARCHAR(24));`,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("weight table created successfully");
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS weight_goals (id INTEGER PRIMARY KEY AUTOINCREMENT, weight VARCHAR(20), date VARCHAR(24));`,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("weight_goals table created successfully");
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS routines (id INTEGER PRIMARY KEY AUTOINCREMENT, dayNum INTEGER, routine VARCHAR(20), type INTEGER);`,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("routines table created successfully");
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )   
    txn.executeSql(`CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY AUTOINCREMENT, date VARCHAR(24), activity VARCHAR(30), type VARCHAR(15));`,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("activities table created successfully");
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS cardioWorkouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(50), trackDistance INTEGER);`,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("cardioWorkouts table created successfully");
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    txn.executeSql(`CREATE TABLE IF NOT EXISTS strengthWorkouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(50), routineId INTEGER, trackTotal INTEGER, everyday INTEGER);`,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("strengthWorkouts table created successfully");
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
    //Level 1 cardio -> stores timed only workouts
    txn.executeSql(`CREATE TABLE IF NOT EXISTS cardioWorkoutsL1 (id INTEGER PRIMARY KEY AUTOINCREMENT, workoutId INTEGER(11), duration REAL, intensity INTEGER, date VARCHAR(24));`,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("cardioWorkoutsL1 table created successfully");
      },
      error => {
        console.log("error creating table " + error.message)
      }
      )
    //Level 2 cardio -> stores distance + timed workouts
    txn.executeSql(`CREATE TABLE IF NOT EXISTS cardioWorkoutsL2 (id INTEGER PRIMARY KEY AUTOINCREMENT, workoutId INTEGER(11), duration REAL, intensity INTEGER, date VARCHAR(24), distance REAL);`,
      [],
      (sqlTxn, res) => {
        if (res.rowsAffected !== 0)
          console.log("cardioWorkoutsL2 table created successfully");
      },
      error => {
        console.log("error creating table " + error.message)
      }
    )
  });
};

exports.dropAllTables = () => {
  db.transaction(tx => {
    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", null, 
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
      )
  })
};