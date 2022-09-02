const db = openDatabase(
  "userDatas",
  "1.0",
  "FIFA AUTO BUYER DB",
  2 * 1024 * 1024
);

db.transaction(function (tx) {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS Filters (filterName,settings);`,
    [],
    function (tx, results) {
      tx.executeSql(
        `CREATE UNIQUE INDEX idx_filters_filterName ON Filters (filterName);`
      );
    }
  );
});

db.transaction(function (tx) {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS CommonSettings (filterName,settings);`,
    [],
    function (tx, results) {
      tx.executeSql(
        `CREATE UNIQUE INDEX idx_commonsettings_filterName ON CommonSettings (filterName);`
      );
    }
  );
});

export const getUserFilters = (tableName = "Filters") => {
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        `SELECT * FROM ${tableName}`,
        [],
        function (tx, results) {
          const filters = {};
          if (results.rows.length) {
            for (let i = 0; i < results.rows.length; i++) {
              filters[results.rows[i].filterName] = results.rows[i].settings;
            }
          }
          resolve(filters);
        },
        function (tx, results) {
          reject(results);
        }
      );
    });
  });
};

export const insertFilters = (filterName, jsonData, tableName = "Filters") => {
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        `REPLACE INTO ${tableName}(filterName,settings) Values (?,?)`,
        [filterName, jsonData],
        function (tx, results) {
          resolve(true);
        },
        function (tx, results) {
          reject(results);
        }
      );
    });
  });
};

export const deleteFilters = (filterName) => {
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        "DELETE FROM Filters WHERE filterName=?",
        [filterName],
        function (tx, results) {
          resolve(true);
        },
        function (tx, results) {
          reject(results);
        }
      );
    });
  });
};
