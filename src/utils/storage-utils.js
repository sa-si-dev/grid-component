import { Utils } from './index';

export class StorageUtils {
  static set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  }

  static get(key, type) {
    let value = localStorage.getItem(key);

    if (type) {
      if (type === 'number') {
        value = parseFloat(value) || 0;
      } else if (type === 'boolean') {
        value = Utils.convertToBoolean(value);
      } else if (type === 'object') {
        value = Utils.convertJsonToObject(value);
      }
    }

    return value;
  }
}

window.GridCompStorageUtils = StorageUtils;
