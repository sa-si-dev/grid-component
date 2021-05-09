class FiltersUtils {
  static filterRows(params) {
    let filtersValue = params.filtersValue;
    let rows = params.rows;
    let isRowVisible = FiltersUtils.isRowVisible;

    return rows.filter((d) => {
      return isRowVisible(d, filtersValue);
    });
  }

  static isRowVisible(rowData, filtersValue) {
    let isVisible = true;
    let isFilterValueMatching = FiltersUtils.isFilterValueMatching;

    filtersValue.some((filterData) => {
      let isMatching = isFilterValueMatching(rowData, filterData);

      if (!isMatching) {
        isVisible = false;
        return true;
      }
    });

    return isVisible;
  }

  static isFilterValueMatching(rowData, filterData) {
    let isMatching = false;
    let colValue = rowData[filterData.key];
    let criteria = filterData.criteria;
    let filterValue = filterData.value;
    let filterValueLowerCase = filterValue;
    let colValueLowerCase = colValue;

    if (typeof filterValueLowerCase === 'string') {
      filterValueLowerCase = filterValueLowerCase.toLowerCase();
    }

    if (typeof colValueLowerCase === 'string') {
      colValueLowerCase = colValueLowerCase.toLowerCase();
    }

    switch (criteria) {
      case 'contains':
        isMatching = colValueLowerCase.indexOf(filterValueLowerCase) !== -1;
        break;
      case 'not_contains':
        isMatching = colValueLowerCase.indexOf(filterValueLowerCase) === -1;
        break;
      case 'is':
      case 'eq':
        if (Array.isArray(filterValue)) {
          isMatching = filterValue.indexOf(String(colValue)) !== -1;
        } else {
          isMatching = colValueLowerCase == filterValueLowerCase;
        }
        break;
      case 'is_not':
      case 'neq':
        if (Array.isArray(filterValue)) {
          isMatching = filterValue.indexOf(String(colValue)) === -1;
        } else {
          isMatching = colValueLowerCase != filterValueLowerCase;
        }
        break;
      case 'starts_with':
        isMatching = colValueLowerCase.indexOf(filterValueLowerCase) === 0;
        break;
      case 'ends_with':
        isMatching = new RegExp(filterValueLowerCase + '$').test(colValueLowerCase);
        break;
      case 'lt':
        isMatching = colValue < filterValue;
        break;
      case 'gt':
        isMatching = colValue > filterValue;
        break;
      case 'lte':
        isMatching = colValue <= filterValue;
        break;
      case 'gte':
        isMatching = colValue >= filterValue;
        break;
    }

    return isMatching;
  }
}
