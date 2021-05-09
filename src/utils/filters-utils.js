import { Utils, DomUtils } from './index';

export class FiltersUtils {
  /** event methods - start */
  static addEvents($container) {
    DomUtils.addEvent($container, 'change', FiltersUtils.onChange);
    DomUtils.addEvent($container, 'keyup', FiltersUtils.onKeyUp);
    DomUtils.addEvent($container, 'click', FiltersUtils.onClick);
  }

  static addTagsEvents($container) {
    DomUtils.addEvent($container, 'click', FiltersUtils.onTagsClick);
  }

  static onChange(e) {
    let $ele = e.target;
    let hasClass = DomUtils.hasClass;

    if (hasClass($ele, 'grid-comp-filter-type-dropdown')) {
      FiltersUtils.onTypesChange(e);
    } else if (hasClass($ele, 'grid-comp-filter-value-ele')) {
      FiltersUtils.onValueChange(e);
    }
  }

  static onKeyUp(e) {
    let $ele = e.target;
    let hasClass = DomUtils.hasClass;

    if (hasClass($ele, 'grid-comp-filter-value-ele grid-comp-input')) {
      FiltersUtils.onValueChange(e);
    }
  }

  static onClick(e) {
    let $ele = e.target;
    let hasClass = DomUtils.hasClass;

    if (hasClass($ele, 'grid-comp-filter-box-clear-button')) {
      FiltersUtils.onClearButtonClick(e);
    } else if (hasClass($ele, 'grid-comp-filters-box-reset-button')) {
      FiltersUtils.onResetButtonClick(e);
    } else if (hasClass($ele, 'grid-comp-filters-box-submit-button')) {
      FiltersUtils.onSubmit(e);
    }
  }

  static onTypesChange(e) {
    let data = FiltersUtils.getData(e);

    data.gridComp.afterFilterTypesChange(e);
  }

  static onValueChange(e) {
    let data = FiltersUtils.getData(e);
    let value = data.value;
    let hasValue = Utils.isNotEmpty(value);
    let $filterSection = data.$filterSection;

    if (hasValue) {
      let valuesCount = Array.isArray(value) ? value.length : 1;

      $filterSection.querySelector('.grid-comp-filter-section-selected-count').innerHTML = valuesCount;
    }

    DomUtils.toggleClass($filterSection, 'has-value', hasValue);

    data.gridComp.afterFilterValueChange(e);
  }

  static onClearButtonClick(e) {
    let data = FiltersUtils.getData(e);

    FiltersUtils.clearFilterValue(data);
  }

  static onResetButtonClick(e) {
    let data = FiltersUtils.getData(e);

    FiltersUtils.resetFiltersValue(data);
  }

  static onSubmit(e) {
    let data = FiltersUtils.getData(e);

    FiltersUtils.submitFiltersValue(data);
  }

  static onTagsClick(e) {
    let data = FiltersUtils.getTagsData(e);
    let $ele = data.$ele;
    let hasClass = DomUtils.hasClass;

    if (hasClass($ele, 'grid-comp-filter-tag-remove-button')) {
      FiltersUtils.onTagRemoveButtonClick(e);
    }
  }

  static onTagRemoveButtonClick(e) {
    let data = FiltersUtils.getTagsData(e);
    let gridComp = data.gridComp;
    let $value = data.$value;
    let colId = DomUtils.getData($value, 'colId');
    let valuesCount = gridComp.$filtersTagsContainer.querySelectorAll(`.grid-comp-filter-tag-value[data-col-id="${colId}"]`).length;

    if (valuesCount === 1) {
      gridComp.removeFilterValue(colId);
    } else {
      let valueIndex = DomUtils.getData(data.$value, 'valueIndex');

      gridComp.removeFilterValue(colId, valueIndex);
    }
  }
  /** event methods - end */

  /** set methods - start */
  static setFiltersValue(gridComp, filtersValue) {
    let filtersValueMapping = Utils.convertArrayToObject(filtersValue);
    let $filterSections = gridComp.$filtersBoxFilterSections.querySelectorAll('.grid-comp-filter-section');
    let setInputValue = DomUtils.setInputValue;
    let getData = DomUtils.getData;

    $filterSections.forEach(($filterSection) => {
      let $filterType = $filterSection.querySelector('.grid-comp-filter-type-dropdown');
      let $filterValue = $filterSection.querySelector('.grid-comp-filter-value-ele');
      let colId = getData($filterSection, 'colId');
      let filterValue = filtersValueMapping[colId] || {};
      let value = filterValue.value || '';
      let criteria = filterValue.criteria;

      if (criteria) {
        setInputValue($filterType, criteria);
      }

      setInputValue($filterValue, value);
    });
  }

  static setFiltersDisplayValue(gridComp, filtersValue) {
    if (Utils.isEmpty(filtersValue)) {
      return filtersValue;
    }

    let objectDeepGet = Utils.objectDeepGet;
    let getSelectedOptionsDisplayValue = gridComp.getSelectedOptionsDisplayValue.bind(gridComp);
    let getColDetailsById = gridComp.getColDetailsById.bind(gridComp);

    filtersValue = filtersValue.map((details) => {
      let d = Object.assign({}, details);
      let colData = getColDetailsById(d.id);
      let filterType = objectDeepGet(colData, 'filter.type');
      let value = d.value;
      let displayValue;

      if (filterType === 'select') {
        displayValue = getSelectedOptionsDisplayValue(colData.filter.options, value);
      } else {
        displayValue = value;
      }

      d.displayValue = displayValue;

      return d;
    });

    return filtersValue;
  }
  /** set methods - end */

  /** get methods - start */
  static getData(e) {
    let $ele = e.target;
    let data = {
      gridComp: $ele.closest('.grid-comp-wrapper').gridComp,
      $filterSection: $ele.closest('.grid-comp-filter-section'),
      $ele,
      value: $ele.value,
    };

    return data;
  }

  static getTagsData(e) {
    let $ele = e.target;
    let data = {
      gridComp: $ele.closest('.grid-comp-wrapper').gridComp,
      $value: $ele.closest('.grid-comp-filter-tag-value'),
      $ele,
    };

    return data;
  }

  static getFiltersValue(gridComp) {
    let filtersValue = [];
    let $filterSections = gridComp.$filtersBoxFilterSections.querySelectorAll('.grid-comp-filter-section.has-value');
    let getData = DomUtils.getData;
    let getInputValue = DomUtils.getInputValue;

    $filterSections.forEach(($filterSection) => {
      let $filterType = $filterSection.querySelector('.grid-comp-filter-type-dropdown');
      let $filterValue = $filterSection.querySelector('.grid-comp-filter-value-ele');
      let filterValue = {
        id: getData($filterSection, 'colId'),
        key: getData($filterSection, 'filterKey'),
        criteria: getInputValue($filterType),
        value: getInputValue($filterValue, true),
      };

      filtersValue.push(filterValue);
    });

    return filtersValue;
  }
  /** get methods - end */

  static clearFilterValue(data) {
    let $valueInput = data.$filterSection.querySelector('.grid-comp-filter-value-ele');

    DomUtils.setInputValue($valueInput, '');
    DomUtils.focusEle($valueInput);

    data.gridComp.afterClearFilterValue(data);
  }

  static resetFiltersValue(data) {
    let $clearButtons = data.gridComp.$filtersBoxFilterSections.querySelectorAll('.grid-comp-filter-box-clear-button');
    let hasReset = false;
    let gridComp = data.gridComp;

    if ($clearButtons) {
      $clearButtons.forEach(($clearButton) => {
        if (DomUtils.isHidden($clearButton)) {
          return;
        }

        hasReset = true;

        DomUtils.dispatchEvent($clearButton, 'click');
      });

      if (hasReset) {
        gridComp.afterResetFiltersValue(data);
      }
    }

    DomUtils.toggleAllAccordion(gridComp.$filtersBoxFilterSections);
  }

  static submitFiltersValue(data) {
    data.gridComp.afterSubmitFiltersValue(data);
  }

  static filterRows(gridComp) {
    let filtersValue = gridComp.getFiltersValue();
    let rows = [...gridComp.originalRows];
    let isRowVisible = FiltersUtils.isRowVisible;

    if (Utils.isNotEmpty(filtersValue)) {
      rows = rows.filter((d) => {
        return isRowVisible(d, filtersValue);
      });
    }

    gridComp.setRows(rows, {
      resetPageDetails: true,
      isOldRows: true,
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

window.GridCompFiltersUtils = FiltersUtils;
