const gridConfig = gridsConfig.sampleGrid;
const defaultApiDelay = 500;
const availableRows = 110;
const maxPerPage = 200;
let dbRows;

class ApiUtils {
  static apiCall(reqData) {
    console.log('reqData - ', Object.assign({}, reqData));

    /** setting sample data */
    if (!dbRows) {
      dbRows = ApiUtils.getRows(availableRows);
    }

    return new Promise((resolve, reject) => {
      reqData = ApiUtils.getReqData(reqData);
      let reqType = reqData.type || 'rows';
      let isSuccess = true;
      let resData;
      let apiDelay = defaultApiDelay;
      let result = ApiUtils.getServerRows(reqData);
      let rowsCount = result.grandTotal;

      if (reqType === 'rows') {
        reqData.hasNextPage = ApiUtils.hasMoreRows(reqData, rowsCount);
        // reqData.grandTotal = rowsCount;
        resData = ApiUtils.getResData(result.rows, reqData);
      } else if (reqType === 'grandTotal') {
        apiDelay = 1000;
        resData = { grandTotal: rowsCount };
      }

      setTimeout(() => {
        if (isSuccess) {
          resolve(resData);
        } else {
          reject(resData);
        }

        console.log('resData - ', resData);
      }, apiDelay);
    });
  }

  static sortRows(rows, sortColKey, sortColOrderAsc) {
    return Utils.sortArrayOfObject(rows, sortColKey, !sortColOrderAsc, true);
  }

  static hasMoreRows(reqData, rowsCount) {
    return rowsCount > reqData.page * reqData.perPage;
  }

  /** get methods - start */
  static getGridConfig(name) {
    let result = gridsConfig[name];

    ApiUtils.setColumnFilterOptions(result.columns);

    return result;
  }

  static getRows(count) {
    if (!count) {
      count = 10;
    }

    let rows = [];
    let columns = gridConfig.columns;
    let randomNumber;
    randomNumber = true;

    let getRow = (i) => {
      let row = {};

      columns.forEach((d) => {
        let key = d.key;
        let id = d.id;
        let number = randomNumber && key !== 'id' ? ApiUtils.getRandomNumber(count) : i;
        let value;
        let filter = d.filter || {};
        let type = filter.type;
        let filterKey = filter.key;

        if (id === 'firstName' || id === 'lastName') {
          value = ApiUtils.getRandomName();
        } else if (id === 'zip') {
          value = ApiUtils.getRandomZip();
        } else if (id === 'amount') {
          let amountResult = ApiUtils.getRandomAmount();
          value = amountResult.text;
          row[filterKey] = amountResult.amount;
        } else if (id === 'ssn') {
          value = ApiUtils.getRandomSsn();
        } else if (id === 'email') {
          value = ApiUtils.getRandomEmail();
        } else if (type === 'select') {
          let optionData = ApiUtils.getRandomOption(filter.options);
          value = optionData.label;
          row[filterKey] = optionData.value;
        } else if (type === 'number') {
          value = number;
        } else {
          value = `${d.name} ${number}`;
        }

        if (key === 'hidden') {
          value += ` - long text will be here to test tooltip`;
        }

        row[key] = value;
      });

      rows.push(row);
    };

    for (let i = 1; i <= count; i++) {
      getRow(i);
    }

    return rows;
  }

  static getServerRows(reqData) {
    let count = reqData.perPage;
    let startIndex = (reqData.page - 1) * count;
    let rows = [...dbRows];
    let filtersValue = [];

    if (reqData.sortBy) {
      rows = ApiUtils.sortRows(rows, reqData.sortBy, reqData.sortOrder !== 'desc');
    }

    for (let k in reqData) {
      let criteriaIndex = k.indexOf('[');

      if (criteriaIndex !== -1) {
        filtersValue.push({
          key: k.substring(0, criteriaIndex),
          criteria: k.substring(criteriaIndex + 1).replace(']', ''),
          value: reqData[k],
        });
      }
    }

    if (filtersValue.length) {
      rows = FiltersUtils.filterRows({
        filtersValue,
        rows,
      });
    }

    let grandTotal = rows.length;
    rows = rows.splice(startIndex, count);

    rows = rows.map((d) => {
      delete d.isRowSelected;

      return d;
    });

    return {
      rows,
      grandTotal,
    };
  }

  static getReqData(reqData = {}) {
    let result = reqData;
    let perPage = reqData.perPage;

    if (!reqData.page) {
      reqData.page = 1;
    } else if (reqData.page === -1) {
      reqData.page = Math.ceil(availableRows / perPage);
    }

    if (!perPage || perPage > maxPerPage) {
      reqData.perPage = maxPerPage;
    }

    return result;
  }

  static getResData(rows, reqData) {
    let result = {
      rows,
      meta: reqData,
    };

    return result;
  }

  static getRandomNumber(maxNumber, minNumber = 1) {
    return Math.floor(Math.random() * (maxNumber - minNumber)) + minNumber;
  }

  static getRandomOption(options) {
    if (typeof options === 'string') {
      options = ApiUtils[options]();
    }

    let index = ApiUtils.getRandomNumber(options.length - 1);

    return options[index];
  }

  static getRandomName() {
    let names = dbTables.name;
    let index = ApiUtils.getRandomNumber(names.length - 1);

    return names[index];
  }

  static getRandomZip() {
    let zip = dbTables.zip;
    let index = ApiUtils.getRandomNumber(zip.length - 1);

    return zip[index];
  }

  static getRandomAmount() {
    let amount = ApiUtils.getRandomNumber(100000, 10);

    return {
      amount,
      text: '$ ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    };
  }

  static getRandomEmail() {
    let email = `${this.getRandomName()}${this.getRandomName()}@${this.getRandomName()}.com`;

    return email.toLowerCase();
  }

  static getRandomSsn() {
    let n1 = ApiUtils.getRandomNumber(999, 100);
    let n2 = ApiUtils.getRandomNumber(99, 10);
    let n3 = ApiUtils.getRandomNumber(9999, 1000);

    return `${n1}-${n2}-${n3}`;
  }

  static getOptions(count = 10) {
    let optionsData = [];

    for (let i = 1; i <= count; i++) {
      let label = 'Option ' + i;

      optionsData.push({ value: i, label });
    }

    return optionsData;
  }

  static getCountryOptions() {
    let countries = dbTables.country;

    return countries.map((d) => {
      return {
        value: d.code,
        label: d.name,
      };
    });
  }

  static getPhoneOptions() {
    let phoneNumbers = dbTables.phone;

    return phoneNumbers.map((d) => {
      return {
        value: d,
        label: d,
      };
    });
  }
  /** get methods - end */

  /** set methods - start */
  static setColumnFilterOptions(columns) {
    columns.forEach((d) => {
      let optionsMethodName;

      if (d.filter) {
        optionsMethodName = d.filter.options;
      }

      if (typeof optionsMethodName === 'string') {
        d.filter.options = ApiUtils[optionsMethodName]();
      }
    });
  }
  /** set methods - end */
}
