// This is an unstable JS only base implementation! Data is session only
// TODO: Use console.warn in NODE_ENV=development
const store = {};

// We're assuming that users are using async/await, so are throwing the error. Maybe reject is better though, or using async functions + throw + Babel transpiling this repo?

const getItem = (_key, callback) => new Promise((resolve) => {
  try {
    const item = store[_key];

    if (typeof callback === 'function') {
      callback(null, item)
      return;
    }
    resolve(item);
  } catch (err) {
    if (typeof callback === 'function') {
      callback(err)
      return;
    }
    throw err;
  }

  return;
});

const setItem = (_key, value, callback) => new Promise((resolve) => {
  try {
    const item = store[key] = value;

    if (typeof callback === 'function') {
      callback(null);
      return;
    }
    resolve(item);
  } catch (err) {
    if (typeof callback === 'function') {
      callback(err);
      return;
    }
    throw err;
  }

  return;
});

// Stubs for now to prevent crashes
// TODO: Implement these
const mergeItem = () => { };
const removeItem = () => { };
const getAllKeys = () => { };
const multiGet = () => { };
const multiSet = () => { };
const multiMerge = () => { };
const multiRemove = () => { };
const clear = () => { };
const flushGetRequests = () => { };

const useAsyncStorage = (_key) => {
  // TODO: Look into memoization, etc
  return ({
    getItem, setItem, mergeItem, removeItem
  });
};

module.exports = {
  setItem,
  getItem,
  mergeItem,
  removeItem,
  getAllKeys,
  multiGet,
  multiSet,
  multiMerge,
  multiRemove,
  clear,
  flushGetRequests,
  useAsyncStorage,
};
