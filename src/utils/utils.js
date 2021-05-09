export class Utils {
  static convertToBoolean(value, defaultValue = false) {
    if (value === true || value === 'true') {
      value = true;
    } else if (value === false || value === 'false') {
      value = false;
    } else {
      value = defaultValue;
    }

    return value;
  }

  static convertJsonToObject(json) {
    let obj;

    try {
      obj = JSON.parse(json);

      if (typeof obj !== 'object') {
        obj = {};
      }
    } catch (e) {
      obj = {};
    }

    return obj;
  }

  static convertArrayToObject(array, key = 'id') {
    if (!Array.isArray(array)) {
      return {};
    }

    let result = {};

    array.forEach((details) => {
      result[details[key]] = details;
    });

    return result;
  }

  static removeArrayEmpty(array) {
    if (!Array.isArray(array) || !array.length) {
      return [];
    }

    return array.filter((d) => !!d);
  }

  static sortArrayOfObject(array, key, reverse, cloneArray) {
    if (!Array.isArray(array)) {
      return array;
    }

    if (cloneArray) {
      array = [...array];
    }

    let getValue = (v) => {
      if (typeof v === 'string') {
        v = v.toLowerCase();
      }

      return v;
    };

    array.sort((a, b) => {
      let valueA = getValue(a[key]);
      let valueB = getValue(b[key]);

      if (valueA == valueB) {
        return 0;
      } else {
        return a[key] > b[key] ? 1 : -1;
      }
    });

    if (reverse) {
      array.reverse();
    }

    return array;
  }

  static findArrayOfObject(array, key, value) {
    if (!Array.isArray(array)) {
      return;
    }

    let objectDeepGet = Utils.objectDeepGet;
    let result = array.find((d) => {
      return objectDeepGet(d, key) === value;
    });

    return result;
  }

  static findArrayIndex(array, key, value) {
    let result = -1;

    if (!Array.isArray(array)) {
      return result;
    }

    let objectDeepGet = Utils.objectDeepGet;

    array.some((d, i) => {
      if (objectDeepGet(d, key) === value) {
        result = i;
        return true;
      }
    });

    return result;
  }

  static i18n(i18nData, key, replaceArray) {
    let result = key;
    let value = i18nData[key];

    if (value) {
      result = value;

      if (replaceArray && replaceArray.length) {
        replaceArray.forEach((v, i) => {
          result = result.replace(new RegExp(`\\{${i}\\}`, 'g'), v);
        });
      }
    }

    return result;
  }

  static getRandomInt(max, min = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min - 1)) + min;
  }

  static objectDeepGet(obj, key) {
    if (!obj) {
      return;
    }

    let tempObj = obj;
    let keys = key.split('.');

    /** removing empty keys */
    keys = keys.filter((v) => v !== '');

    keys.some((path) => {
      tempObj = tempObj[path];

      return typeof tempObj !== 'object' || tempObj === null;
    });

    return tempObj;
  }

  static objectDeepSet(obj, key, value) {
    if (!key) {
      return;
    }

    if (!obj) {
      obj = {};
    }

    let parentObj = obj;
    let keys = key.split('.');
    let lastKey = keys.pop();

    keys.forEach((path) => {
      if (typeof parentObj[path] !== 'object') {
        parentObj[path] = {};
      }

      parentObj = parentObj[path];
    });

    parentObj[lastKey] = value;

    return obj;
  }

  static objectDeepDelete(obj, key) {
    if (!obj || !key) {
      return;
    }

    let lastObj = obj;
    let keys = key.split('.');
    let lastKey = keys.pop();

    keys.some((path) => {
      lastObj = lastObj[path];

      return lastObj === undefined;
    });

    if (typeof lastObj === 'object') {
      delete lastObj[lastKey];
    }

    return obj;
  }

  static isEmpty(value) {
    let result = false;

    if (!value) {
      result = true;
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        result = true;
      }
    } else if (typeof value === 'object') {
      if (Object.keys(value).length === 0) {
        result = true;
      }
    }

    return result;
  }

  static isNotEmpty(value) {
    return !this.isEmpty(value);
  }

  static isAnyEmpty(...values) {
    return values.some((d) => Utils.isEmpty(d));
  }

  static getSelectedOptionsDisplayValue(options, value) {
    if (Utils.isAnyEmpty(options, value)) {
      return value;
    }

    let result;

    if (Array.isArray(value)) {
      result = [];

      options.forEach((d) => {
        let _value = d.value;

        if (_value || _value === 0) {
          _value = _value.toString();
        }

        if (value.indexOf(_value) !== -1) {
          result.push(d.label);
        }
      });
    } else {
      options.some((d) => {
        if (d.value == value) {
          result = d.label;
          return true;
        }
      });
    }

    return result;
  }
}

window.GridCompUtils = Utils;
