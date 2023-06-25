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

exports.addRoutine = async (routine) => {
  
  let dayNum = await findClosestDayNum() 

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO routines (dayNum, routine) VALUES (?, ?)",
        [dayNum, routine],
        null,
        (txObj, resultSet) => {
          console.log('Success');
          resolve();
        },
        (txObj, error) => {
          console.log('Error:', error);
          reject(error);
        }
      );
    });
  });
};

// Helper function to find the closest number to 0 that has not already been filled
const findClosestDayNum = () => {
  const table = 'routines';

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT dayNum FROM routines",
        [],
        (txObj, resultSet) => {

          if(resultSet.rows.length == 0)
            resolve(1);
          else {
            const existingDayNums = resultSet.rows._array.map((row) => row.dayNum);
            let lowestNonTakenNum = 1; // Start from 1
            
            while (existingDayNums.includes(lowestNonTakenNum)) 
              lowestNonTakenNum++;
            
            resolve(lowestNonTakenNum);
          }
        },
        (txObj, error) => {
          console.log('Error:', error);
          reject(error);
        }
      );
    });
  });
};

