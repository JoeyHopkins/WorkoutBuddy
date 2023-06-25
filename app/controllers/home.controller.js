import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.getAllRoutines = (setRoutineList, setLoading) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM routines ORDER BY dayNum",
        null,
        (txObj, { rows: { _array } }) => { 
          setRoutineList(_array)
          resolve()
          // setLoading(false)
        },
        (txObj, error) => { console.log('Error ', error) },
      );
    });
  });
};

exports.addRoutine = async (routine) => {
  let dayNum = await findClosestDayNum() 

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO routines (dayNum, routine) VALUES (?, ?)",
        [dayNum, routine],
        (txObj, resultSet) => {
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

exports.deleteRoutineByID = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("DELETE FROM routines WHERE id = ?", [id],
        (txObj, ResultSet) => {
          resolve()
        },
        (txObj, error) => { console.log('Error ', error) },
      );
    });
  });
};

exports.moveRoutineUp = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT id, dayNum FROM routines ORDER BY dayNum ASC",
        [],
        async (txObj, resultSet) => {
          const rows = resultSet.rows._array;
          
          if (rows.length === 0) {
            reject(new Error('No routines found'));
            return;
          }

          for(let i in rows) {
            if (rows[i].id === id) {

              if(parseInt(i) === 0 && rows[i].dayNum === 1)
                return reject(new Error('Cannot move routine up anymore'));

              let dayNum = rows[i].dayNum;
              let priorID = rows[i-1].id;
              let priorDayNum = rows[i-1].dayNum;

              if(dayNum - 1 === priorDayNum)
                resolve(await exchangeRoutineDayNum(id, dayNum, priorID, priorDayNum));
              else 
                resolve(await updateRoutineDayNum(id, dayNum, dayNum - 1));
            }
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

async function exchangeRoutineDayNum(id, currentDayNum, priorID, priorDayNum) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Update the current routine's dayNum with priorDayNum
      tx.executeSql(
        "UPDATE routines SET dayNum = ? WHERE id = ?",
        [priorDayNum, id],
        (txObj, resultSet) => {
          // Update the prior routine's dayNum with currentDayNum
          tx.executeSql(
            "UPDATE routines SET dayNum = ? WHERE id = ?",
            [currentDayNum, priorID],
            () => {
              resolve();
            },
            (txObj, error) => {
              console.log('Error:', error);
              reject(error);
            }
          );
        },
        (txObj, error) => {
          console.log('Error:', error);
          reject(error);
        }
      );
    });
  });
}

async function updateRoutineDayNum(id, currentDayNum, newDayNum) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE routines SET dayNum = ? WHERE id = ?",
        [newDayNum, id],
        () => {
          resolve();
        },
        (txObj, error) => {
          console.log('Error:', error);
          reject(error);
        }
      );
    });
  });
}