let db;

const initDatabase = () => {
  let indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  let request = indexedDB.open("userDatasAB", 2);

  request.onupgradeneeded = function (e) {
    db = request.result;
    try {
      if (e.oldVersion < 1) {
        db.createObjectStore("Filters", { keyPath: "filterName" });
      }
      if (e.oldVersion < 2) {
        db.createObjectStore("CommonSettings", { keyPath: "filterName" });
      }
    } catch (e) {}
  };

  request.onsuccess = function () {
    db = request.result;
  };
};

const getUserFilters = (storeName = "Filters") => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = function () {
      const filters = {};
      if (request.result.length) {
        for (let i = 0; i < request.result.length; i++) {
          filters[request.result[i].filterName] = request.result[i].jsonData;
        }
      }
      resolve(filters);
    };
    request.onerror = function () {
      reject();
    };
  });
};

const insertFilters = (filterName, jsonData, storeName = "Filters") => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put({ filterName, jsonData });

    tx.oncomplete = function () {
      resolve();
    };
    tx.onerror = function () {
      reject();
    };
  });
};

const deleteFilters = (filterName) => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("Filters", "readwrite");
    const store = tx.objectStore("Filters");
    store.delete(filterName);
    tx.oncomplete = function () {
      resolve();
    };
    tx.onerror = function () {
      reject();
    };
  });
};

export default {
  initDatabase,
  deleteFilters,
  insertFilters,
  getUserFilters,
};
