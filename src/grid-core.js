import { Utils, DomUtils, StorageUtils, FiltersUtils } from './utils';
import { importSvgIcons, icon, animatedIcon } from './icons';
import { i18n } from './i18n';
import { config, filterConfig } from './config';

export class GridCoreComponent {
  /**
   * @property {(element|string)} ele - Parent element to render Grid
   * @property {string} title - Title to show in the header
   * @property {string} [uniqueKey] - Unique key to save grid settings in the localstorage
   * @property {string} [apiUrl] - API url to use to get rows from server
   * @property {string} [heightOffset] - Space to leave on top and bottom of the grid
   * @property {boolean} [disableLocalstorage=false] - Disabling localstorage to save grid settings
   * @property {boolean} [scrollableContent=true] - Make header and footer fixed by making rows scrollable
   * @property {boolean} [rowsFromServer=true] - Get grid rows from server through api
   * @property {boolean} [resizable=true] - Allow to resize all columns
   * @property {boolean} [sortable=false] - Allow to sort all columns
   * @property {boolean} [exportable=false] - To show export button
   * @property {boolean} [hideHeader=false] - Hide header section of component
   * @property {boolean} [showFilters=false] - Show filters button to open filters
   * @property {boolean} [showSettings=false] - Show settings button to customize columns
   * @property {boolean} [showSerialNumberCol=false] - Show serial number column
   * @property {boolean} [showSelectableCol=false] - Show checkbox column to select rows
   * @property {(string[]|object[])} [selectedRowsActions] - List of action buttons to show when rows selected.
   * @property {string} [theme=light] - Default available themes are light and dark. But you could define custom themes and use here.
   * @property {string} [language=default] - Language name to get i18n text
   * @property {string} [tooltipFontSize=14px] - Font size for tooltip
   * @property {string} [tooltipAlignment=center] - CSS Text alignment for tooltip
   * @property {string} [tooltipEnterDelay=300] - Delay time before showing tooltip (in milliseconds)
   * @property {number[]} [perPageOptions=[25, 50, 100]] - List of options for per page dropdown
   * @property {boolean} [rowsFromServer=true] - Get rows from server through API call
   * @property {object[]} rows - List of rows details. It would be used to render static rows instead of getting from server.
   *
   * @property {object[]} columns - List of columns details
   * @property {string} columns[].id - Unique column ID (string without space or special characters)
   * @property {string} columns[].name - Column header text
   * @property {string} columns[].key - Property name to get column value from row details
   * @property {string} [columns[].width] - Width of the column (in px)
   * @property {string} [columns[].align=left] - CSS text align value (left, right, center)
   * @property {function} [columns[].renderer] - Callback method name to render column value
   * @property {function} [columns[].headRenderer] - Callback method name to render column header
   * @property {boolean} [columns[].sticky=false] - Make the column fixed on scroll horizontally
   * @property {boolean} [columns[].resizable] - Allow to resize width of the column
   * @property {boolean} [columns[].sortable] - Make the column sortable
   * @property {boolean} [columns[].hidden] - Hide the column
   * @property {boolean} [columns[].alwaysShow=false] - Not allowed to hide the column in the settings
   *
   * @property {object} [columns[].filter] - Filter details of the column
   * @property {string} [filter.type=text] - Type of filter field to render. (Available types - text, number, select)
   * @property {string} [filter.key] - Property name to set filter value. If not given key from column details would be used.
   * @property {string[]} [filter.criteria] - List of criteria to show as dropdown options
   * @property {string[]} [filter.renderer] - Callback method name to render filter section
   * @property {boolean} [filter.multiple=false] - Allow multiple values in filter field type select
   * @property {boolean} [filter.allowDecimal=false] - Allow decimal number in filter field type number
   *
   * @property {array} [columns[].filter.options] - List of options for filter field type select
   * @property {string} [options[].value] - Filter field type select option value
   * @property {string} [options[].label] - Filter field type select option display text
   *
   * @property {array} [filtersValue] - Default filters value to show as filters tags and prefill filters form on render
   * @property {string} [filtersValue[].id] - Same as columns[].id
   * @property {string} [filtersValue[].key] - Same as filter.key or columns[].key
   * @property {string} [filtersValue[].criteria] - Criteria to apply filter value
   * @property {(string|array)} [filtersValue[].value] - Value to filter rows
   */
  constructor(options) {
    try {
      let $ele = DomUtils.getElement(options.ele);

      if (!$ele) {
        return;
      }

      options.ele = $ele;

      this.setProps(options);
      GridCoreComponent.setTheme(this.theme);
      this.render();
      this.addEvents();
    } catch (e) {
      console.error(e);
    }
  }

  /** render methods - start */
  render() {
    let html = `<div class="grid-comp-wrapper" data-unique-id="${this.uniqueId}">
        <div class="grid-comp-header grid-comp-hide"></div>

        <div class="grid-comp-filters-tags-wrapper">
          <div class="grid-comp-filters-tags-container"></div>
        </div>

        <div class="grid-comp-table-wrapper">
          <div class="grid-comp-table-container">
            <table class="grid-comp-table">
              <thead class="grid-comp-thead"></thead>
              <tbody class="grid-comp-tbody"></tbody>
            </table>
          </div>

          <div class="grid-comp-rows-loader"></div>
          <div class="grid-comp-no-rows">${this.i18n('no.rows')}</div>
          <div class="grid-comp-more-right-column-shadow"></div>
          <div class="grid-comp-col-resizing-line"></div>
        </div>

        <div class="grid-comp-footer"></div>
        <div class="grid-comp-filters-box-wrapper"></div>
        <div class="grid-comp-settings-popover-container"></div>
        <div class="grid-comp-selected-rows-action-box-wrapper"></div>
      </div>`;

    this.$ele.innerHTML = html;
    this.$wrapper = this.$ele.querySelector('.grid-comp-wrapper');
    this.$header = this.$wrapper.querySelector('.grid-comp-header');
    this.$filtersTagsContainer = this.$wrapper.querySelector('.grid-comp-filters-tags-container');
    this.$footer = this.$wrapper.querySelector('.grid-comp-footer');
    this.$tableWrapper = this.$wrapper.querySelector('.grid-comp-table-wrapper');
    this.$tableContainer = this.$wrapper.querySelector('.grid-comp-table-container');
    this.$thead = this.$wrapper.querySelector('.grid-comp-thead');
    this.$tbody = this.$wrapper.querySelector('.grid-comp-tbody');
    this.$resizingLine = this.$wrapper.querySelector('.grid-comp-col-resizing-line');
    this.$filtersBoxWrapper = this.$wrapper.querySelector('.grid-comp-filters-box-wrapper');
    this.$settingsPopoverContainer = this.$wrapper.querySelector('.grid-comp-settings-popover-container');
    this.$selectedRowsActionsBoxWrapper = this.$wrapper.querySelector('.grid-comp-selected-rows-action-box-wrapper');

    this.afterRenderWrapper();
  }

  renderHeader() {
    if (this.hideHeader) {
      return;
    }

    let getTooltipAttrText = this.getTooltipAttrText.bind(this);
    let i18n = this.i18n.bind(this);
    let title = '';
    let filtersButton = '';
    let exportButton = '';
    let settingsButton = '';
    let iconSizeMedium = config.iconSizeMedium;

    if (this.title) {
      title = `<span class="grid-comp-header-title">${this.title}</span>`;
    }

    if (this.showFilters) {
      filtersButton = `<span class="grid-comp-icon-button grid-comp-filters-button first-child" ${getTooltipAttrText(i18n('filters'))}>
          ${icon('filter', { size: iconSizeMedium })}
        </span>`;
    }

    if (this.exportable) {
      exportButton = this.renderExportButton();
    }

    if (this.showSettings) {
      settingsButton = `<span class="grid-comp-icon-button grid-comp-settings-button" ${getTooltipAttrText(i18n('customize'))}>
          ${icon('settings', { size: iconSizeMedium })}
        </span>`;
    }

    let html = `
      <div class="grid-comp-header-left">
        ${title}
      </div>

      <div class="grid-comp-header-right">
        ${filtersButton}
        ${exportButton}
        ${settingsButton}
      </div>
    `;

    this.$header.innerHTML = html;
    this.$settingsButton = this.$wrapper.querySelector('.grid-comp-settings-button');

    this.show(this.$header);
  }

  renderExportButton() {
    let html = `<span class="grid-comp-icon-button grid-comp-export-button" ${this.getTooltipAttrText(this.i18n('export'))}>
        ${icon('download', { size: config.iconSizeMedium })}
      </span>`;

    return html;
  }

  renderFooter() {
    let getTooltipAttrText = this.getTooltipAttrText.bind(this);
    let i18n = this.i18n.bind(this);
    let navButtonClasses = 'grid-comp-icon-button grid-comp-page-nav-button disabled';

    let html = `
      <div class="grid-comp-footer-left"></div>

      <div class="grid-comp-footer-right grid-comp-hide">
        <div class="grid-comp-grand-total-container">
          <span class="grid-comp-grand-total-label">${this.i18n('total.count')}:</span>
          <span class="grid-comp-grand-total-text"></span>
          <span class="grid-comp-grand-total-button">${this.i18n('show')}</span>
          <span class="grid-comp-grand-total-loader">${animatedIcon('processing-circle')}</span>
        </div>

        <div class="grid-comp-per-page-container"></div>

        <div class="grid-comp-page-nav-container">
          <span class="${navButtonClasses} grid-comp-page-nav-button-first" ${getTooltipAttrText(i18n('first.page'))}>
            ${icon('page-first')}
          </span>
          <span class="${navButtonClasses} grid-comp-page-nav-button-prev" ${getTooltipAttrText(i18n('previous.page'))}>
            ${icon('page-prev')}
          </span>

          <span class="grid-comp-rows-count-container"></span>

          <span class="${navButtonClasses} grid-comp-page-nav-button-next" ${getTooltipAttrText(i18n('next.page'))}>
            ${icon('page-next')}
          </span>
          <span class="${navButtonClasses} grid-comp-page-nav-button-last" ${getTooltipAttrText(i18n('last.page'))}>
            ${icon('page-last')}
          </span>
        </div>
      </div>
    `;

    this.$footer.innerHTML = html;
    this.$footerRight = this.$wrapper.querySelector('.grid-comp-footer-right');
    this.$grandTotalContainer = this.$wrapper.querySelector('.grid-comp-grand-total-container');
    this.$grandTotalText = this.$wrapper.querySelector('.grid-comp-grand-total-text');
    this.$perPageContainer = this.$wrapper.querySelector('.grid-comp-per-page-container');
    this.$rowsCountContainer = this.$wrapper.querySelector('.grid-comp-rows-count-container');
    this.$pageNavFirst = this.$wrapper.querySelector('.grid-comp-page-nav-button-first');
    this.$pageNavLast = this.$wrapper.querySelector('.grid-comp-page-nav-button-last');
    this.$pageNavPrev = this.$wrapper.querySelector('.grid-comp-page-nav-button-prev');
    this.$pageNavNext = this.$wrapper.querySelector('.grid-comp-page-nav-button-next');

    this.afterRenderFooter();
  }

  renderTHead() {
    let html = '';

    this.visibleColumns.forEach((d) => {
      html += this.renderTHeadColumn(d);
    });

    html += '<th class="grid-comp-col grid-comp-observer-col"></th>';
    html = `<tr class="grid-comp-row">${html}</tr>`;

    this.$thead.innerHTML = html;
    this.$columns = this.$wrapper.querySelectorAll('.grid-comp-col:not(.grid-comp-observer-col)');
    this.$sortIcons = this.$wrapper.querySelectorAll('.grid-comp-col-sort-icon');

    this.afterRenderTHead();
  }

  renderTHeadColumn(colData) {
    let classNames = 'grid-comp-col';
    let textContainerClassNames = 'grid-comp-col-text-container';
    let rightSection = '';
    let rightOutSection = '';
    let sortIcon = '';
    let resizable = colData.resizable;
    let sortable = colData.sortable;
    let colStyle = {};

    let colAttrData = {
      'data-column-id': colData.id,
      'data-index': colData.index,
      'data-width': colData.width,
      'data-visible-index': colData.visibleIndex,
    };

    if (colData.isFirst) {
      classNames += ' first-child';
    }

    if (colData.isLast) {
      classNames += ' last-child';
    }

    if (colData.align) {
      colStyle['justify-content'] = config.colAlignMapping[colData.align];
    }

    if (colData.sticky) {
      classNames += ' grid-comp-col-sticky';
      rightOutSection += '<span class="grid-comp-col-sticky-shadow"></span>';
    }

    if (resizable) {
      rightSection += `<span class="grid-comp-icon-button grid-comp-col-resize-button">${icon('col-resize')}</span>`;
    }

    if (sortable) {
      let sortTooltip = this.getTooltipAttrText('');
      sortIcon = `<span class="grid-comp-icon-button grid-comp-col-sort-icon" ${sortTooltip}>${icon('col-sort', { size: config.iconSizeSmall })}</span>`;
      textContainerClassNames += ' grid-comp-col-sort-button';
    }

    let colName = colData.name || '';
    let textTooltip = this.getTooltipAttrText(colName, true);
    let colHeadText;

    if (colData.headRenderer && typeof this[colData.headRenderer] === 'function') {
      colHeadText = this[colData.headRenderer](colData);
    } else {
      colHeadText = `<span class="grid-comp-col-text" ${textTooltip}>
          ${colName}
        </span>`;
    }

    let html = `<th class="${classNames}" ${DomUtils.getAttributesText(colAttrData)}>
      <div class="grid-comp-col-content">
        <div class="${textContainerClassNames}" ${DomUtils.getStyleText(colStyle)}>
          ${colHeadText}
          ${sortIcon}
        </div>
        ${rightSection}
      </div>
      ${rightOutSection}
    </th>`;

    return html;
  }

  renderRows() {
    let html = '';

    this.visibleRows.forEach((d) => {
      html += this.renderRow(d);
    });

    this.$tbody.innerHTML = html;
    this.$columns = this.$wrapper.querySelectorAll('.grid-comp-col:not(.grid-comp-observer-col)');
    this.$selectableColCheckbox = this.$wrapper.querySelectorAll('.grid-comp-selectable-col-checkbox');

    this.afterRenderRows();
  }

  renderRow(rowData) {
    let html = '';

    this.visibleColumns.forEach((colData) => {
      html += this.renderColumn(colData, rowData);
    });

    html += '<td class="grid-comp-col grid-comp-observer-col"></td>';
    html = `<tr class="grid-comp-row" data-row-index="${rowData.rowIndex}">${html}</tr>`;

    return html;
  }

  renderColumn(colData, rowData) {
    let html;
    let key = colData.key;
    let value = key ? rowData[colData.key] : '';
    let classNames = 'grid-comp-col';
    let textTooltip = this.getTooltipAttrText(value, true);
    let rightOutSection = '';
    let colStyle = {};

    let colAttrData = {
      'data-index': colData.index,
      'data-width': colData.width,
      'data-visible-index': colData.visibleIndex,
    };

    if (colData.renderer && typeof this[colData.renderer] === 'function') {
      html = this[colData.renderer](colData, rowData);
    } else {
      html = `<span class="grid-comp-col-text" ${textTooltip}>
          ${value}
        </span>`;
    }

    if (colData.isFirst) {
      classNames += ' first-child';
    }

    if (colData.isLast) {
      classNames += ' last-child';
    }

    if (colData.sticky) {
      classNames += ' grid-comp-col-sticky';
      rightOutSection += '<span class="grid-comp-col-sticky-shadow"></span>';
    }

    if (colData.align) {
      colStyle['justify-content'] = config.colAlignMapping[colData.align];
    }

    html = `<td class="${classNames}" ${DomUtils.getAttributesText(colAttrData)}>
      <div class="grid-comp-col-content" ${DomUtils.getStyleText(colStyle)}>
        ${html}
      </div>
      ${rightOutSection}
    </td>`;

    return html;
  }

  renderSelectableCol(colData, rowData) {
    let value = rowData[colData.key];
    let textTooltip = '';
    let data = {
      id: `grid-comp-selectable-col-checkbox-${this.uniqueId}-${value}`,
      inputClass: 'grid-comp-selectable-col-checkbox',
      checked: rowData.isRowSelected,
      disabled: !rowData.isRowSelectable,
    };

    if (rowData.isRowSelectableMessage) {
      textTooltip = this.getTooltipAttrText(rowData.isRowSelectableMessage);
    }

    let html = this.renderCheckbox(data);
    html = `<span class="grid-comp-selectable-col-checkbox-container" ${textTooltip}>${html}</span>`;

    return html;
  }

  renderSortIcons() {
    let sortColIndex = this.sortColIndex;
    let orderClassName;
    let orderTooltip;

    if (this.sortColOrderAsc) {
      orderClassName = 'asc';
      orderTooltip = this.i18n('ascending');
    } else {
      orderClassName = 'desc';
      orderTooltip = this.i18n('descending');
    }

    this.$sortIcons.forEach(($ele) => {
      let colIndex = DomUtils.getData($ele.closest('.grid-comp-col'), 'index');
      let iconName;
      let _orderTooltip = '';

      if (colIndex === sortColIndex) {
        iconName = 'col-sort-active';
        _orderTooltip = orderTooltip;
      } else {
        iconName = 'col-sort';
      }

      $ele.innerHTML = icon(iconName, { className: orderClassName, size: config.iconSizeSmall });
      DomUtils.setData($ele, 'tooltip', _orderTooltip);
    });
  }

  renderPerPageDropdown() {
    let data = {
      $container: this.$perPageContainer,
      class: 'grid-comp-per-page-dropdown',
      options: this.getPerPageOptions(),
      hideClearButton: true,
      autoSelectFirstOption: true,
      additionalClasses: 'no-border transparent',
      silentInitialValueSet: true,
    };

    this.renderDropdown(data);

    this.$perPageDropdown = this.$wrapper.querySelector('.grid-comp-per-page-dropdown');
  }

  renderGrandTotal() {
    let grandTotal = this.pageDetails.grandTotal;
    let hasGrandTotal = grandTotal ? true : false;

    if (hasGrandTotal) {
      this.$grandTotalText.innerHTML = grandTotal;
    }

    DomUtils.toggleClass(this.$grandTotalContainer, 'has-grand-total', hasGrandTotal);
  }

  renderRowsCount() {
    let rowsRange = this.getRowsRange();
    let hasRows = rowsRange.start;

    if (hasRows) {
      this.$rowsCountContainer.innerHTML = `${rowsRange.start} - ${rowsRange.end}`;
    }

    this.toggle(this.$rowsCountContainer, hasRows);
  }

  renderSettingsPopover() {
    let i18n = this.i18n.bind(this);
    let searchInputData = {
      class: 'grid-comp-settings-popover-search-container',
      inputClass: 'grid-comp-search-comp-input grid-comp-settings-popover-search-input',
      placeholder: i18n('search'),
      iconName: 'search',
      iconPosition: 'left',
      hasClearButton: true,
    };

    let html = `<div class="grid-comp-popover grid-comp-settings-popover pop-comp-wrapper grid-comp-search-comp-container">
      <div class="grid-comp-settings-popover-header">
        ${this.renderInput(searchInputData)}
      </div>

      <div class="grid-comp-settings-popover-body grid-comp-more-shadow-container">
        <div class="grid-comp-more-shadow-content sortable-comp-container"></div>
      </div>

      <div class="grid-comp-settings-popover-footer">
        <button class="grid-comp-button grid-comp-button-small grid-comp-settings-save-button">
          ${i18n('save')}
        </button>
        <button class="grid-comp-button grid-comp-button-secondary grid-comp-button-small grid-comp-settings-cancel-button">
          ${i18n('cancel')}
        </button>
      </div>
    </div>`;

    this.$settingsPopoverContainer.innerHTML = html;
    this.$settingsPopover = this.$wrapper.querySelector('.grid-comp-settings-popover');
    this.$settingsPopoverSearchInput = this.$wrapper.querySelector('.grid-comp-settings-popover-search-input');
    this.$settingsPopoverBody = this.$wrapper.querySelector('.grid-comp-settings-popover-body');
    this.$settingsPopoverBodyContent = this.$settingsPopoverBody.querySelector('.grid-comp-more-shadow-content');

    this.afterRenderSettingsPopover();
  }

  renderSettingsColumnItems() {
    let renderSettingsColumnItem = this.renderSettingsColumnItem.bind(this);
    let html = `<div class="grid-comp-search-comp-no-result">${this.i18n('no.search.result')}</div>`;

    this.columns.forEach((d) => {
      html += renderSettingsColumnItem(d);
    });

    this.$settingsPopoverBodyContent.innerHTML = html;
  }

  renderSettingsColumnItem(d) {
    if (d.sticky) {
      return '';
    }

    let name = d.name;
    let itemClass = 'grid-comp-settings-column-item grid-comp-search-comp-item sortable-comp-item';
    let switchHtml = '';

    if (!d.alwaysShow) {
      let switchData = {
        id: `grid-comp-settings-column-item-switch-${this.uniqueId}-${d.id}`,
        inputClass: 'grid-comp-settings-column-item-switch',
        class: 'has-child-action',
        value: name,
      };

      if (!d.hidden) {
        switchData.checked = true;
      }

      switchHtml = this.renderSwitch(switchData);
    }

    let html = `<div class="${itemClass}" data-col-id="${d.id}">
        <span class="grid-comp-icon-button grid-comp-settings-column-item-order-button">${icon('grip', { size: '12px' })}</span>
        <span class="grid-comp-settings-column-item-name" ${this.getTooltipAttrText(name, true)}>${name}</span>
        ${switchHtml}
      </div>`;

    return html;
  }

  renderFiltersBox() {
    let i18n = this.i18n.bind(this);

    let html = `<div class="grid-comp-filters-box-container grid-comp-animation grid-comp-animation-slide-in-right">
        <div class="grid-comp-filters-box-header">
          <span class="grid-comp-filters-box-title">${i18n('filters')}</span>
          <span class="grid-comp-filters-box-reset-button">${i18n('reset')}</span>
        </div>

        <div class="grid-comp-filters-box-body grid-comp-more-shadow-container">
          ${this.renderFilterSections()}
        </div>

        <div class="grid-comp-filters-box-footer">
          <button class="grid-comp-button grid-comp-filters-box-submit-button">
            ${i18n('submit')}
          </button>
          <button class="grid-comp-button grid-comp-button-secondary grid-comp-filters-box-cancel-button">
            ${i18n('cancel')}
          </button>
        </div>
      </div>`;

    this.$filtersBoxWrapper.innerHTML = html;
    this.$filtersBoxFilterSections = this.$wrapper.querySelector('.grid-comp-filter-sections');

    this.afterRenderFiltersBox();
  }

  renderFilterSections() {
    let renderFilterSection = this.renderFilterSection.bind(this);
    let html = '<div class="grid-comp-filter-sections grid-comp-more-shadow-content grid-comp-accordion-wrapper">';

    this.columns.forEach((d) => {
      if (!d.filter) {
        return;
      }

      html += renderFilterSection(d);
    });

    html += '</div>';

    return html;
  }

  renderFilterSection(d) {
    let colName = d.name;
    let id = d.id;
    let getTooltipAttrText = this.getTooltipAttrText.bind(this);
    let i18n = this.i18n.bind(this);
    let filterKey = this.getFilterKey(d);
    let sectionAttributes = {
      class: 'grid-comp-filter-section grid-comp-accordion-container',
      'data-filter-key': filterKey,
      'data-col-id': d.id,
    };

    let html = `<div ${DomUtils.getAttributesText(sectionAttributes)}>
        <div class="grid-comp-accordion-header">
          <div class="grid-comp-accordion-title" ${getTooltipAttrText(colName, true)}>${colName}</div>

          <div class="grid-comp-filter-section-selected-count"></div>

          <div id="grid-comp-filter-type-dropdown-container-${this.uniqueId}-${id}" class="grid-comp-filter-type-dropdown-container
            grid-comp-has-child-action">
          </div>

          <span class="grid-comp-icon-button grid-comp-filter-box-clear-button grid-comp-has-child-action" ${getTooltipAttrText(i18n('clear'))}>
            ${icon('clear')}
          </span>

          <span class="grid-comp-icon-button grid-comp-accordion-header-button">
            ${icon('arrow-down', { className: 'grid-comp-accordion-header-icon' })}
          </span>
        </div>

        <div class="grid-comp-accordion-body">
          <div id="grid-comp-filter-field-container-${this.uniqueId}-${d.id}" class="grid-comp-filter-field-container"></div>
        </div>
      </div>`;

    return html;
  }

  renderFilterTypeDropdowns() {
    let renderFilterTypeDropdown = this.renderFilterTypeDropdown.bind(this);

    this.columns.forEach((d) => {
      if (!d.filter) {
        return;
      }

      renderFilterTypeDropdown(d);
    });
  }

  renderFilterTypeDropdown(d) {
    let filter = d.filter;
    let criteria = filter.criteria || Utils.objectDeepGet(filterConfig, `types.${filter.type}.criteria`);
    let i18n = this.i18n.bind(this);

    let data = {
      $container: document.querySelector(`#grid-comp-filter-type-dropdown-container-${this.uniqueId}-${d.id}`),
      class: 'grid-comp-filter-type-dropdown',
      hideClearButton: true,
      autoSelectFirstOption: true,
      additionalClasses: 'no-border',
      optionHeight: '30px',
      optionsCount: 6,
    };

    if (criteria) {
      data.options = criteria.map((v) => {
        return {
          value: v,
          label: i18n(`criteria.${v}`),
        };
      });
    }

    this.renderDropdown(data);
  }

  renderFilterFields() {
    let renderFilterField = this.renderFilterField.bind(this);

    this.columns.forEach((d) => {
      if (!d.filter) {
        return;
      }

      renderFilterField(d);
    });
  }

  renderFilterField(colData) {
    let filterData = colData.filter;
    let $fieldContainer = document.querySelector(`#grid-comp-filter-field-container-${this.uniqueId}-${colData.id}`);
    let rendererName;

    if (filterData.renderer && typeof this[filterData.renderer] === 'function') {
      rendererName = filterData.renderer;
    } else {
      let filterTypeFieldRendererMapping = config.filterTypeFieldRendererMapping;
      rendererName = filterTypeFieldRendererMapping[filterData.type] || filterTypeFieldRendererMapping['default'];
    }

    if (rendererName) {
      this[rendererName](colData, $fieldContainer);
    }
  }

  renderFilterFieldForText(colData, $container) {
    let data = {
      inputClass: 'grid-comp-filter-value-ele full-border',
    };

    $container.innerHTML = this.renderInput(data);
  }

  renderFilterFieldForNumber(colData, $container) {
    let filterData = colData.filter;
    let data = {
      inputClass: 'grid-comp-filter-value-ele full-border',
      allowDecimal: filterData.allowDecimal,
    };

    $container.innerHTML = this.renderInputNumber(data);
  }

  renderFilterFieldForSelect(colData, $container) {
    let filterData = colData.filter;
    let data = {
      $container,
      options: filterData.options,
      search: true,
      multiple: filterData.multiple,
      class: 'grid-comp-filter-value-ele',
      additionalClasses: 'full-border',
    };

    this.renderDropdown(data);
  }

  renderFiltersTags() {
    let filtersValue = this.getFiltersValue();
    filtersValue = this.setFiltersDisplayValue(filtersValue);
    let renderFilterTags = this.renderFilterTags.bind(this);
    let html = '';

    filtersValue.forEach((d) => {
      html += renderFilterTags(d);
    });

    html += `<span class="grid-comp-icon-button grid-comp-filters-tags-more-button">
        ${icon('arrow-down')}
      </span>`;

    this.$filtersTagsContainer.innerHTML = html;
    this.$filterTagItems = this.$wrapper.querySelectorAll('.grid-comp-filter-tag-item');
    this.hasFiltersTags = filtersValue.length ? true : false;

    DomUtils.toggleClass(this.$wrapper, 'has-filters-tags', this.hasFiltersTags);

    this.afterRenderFiltersTags();
  }

  renderFilterTags(d) {
    let colData = this.getColDetailsById(d.id);

    if (!colData) {
      return '';
    }

    let getTooltipAttrText = this.getTooltipAttrText.bind(this);
    let getAttributesText = DomUtils.getAttributesText;
    let i18n = this.i18n.bind(this);
    let html = '';
    let displayValues = d.displayValue;
    let colId = colData.id;

    if (!Array.isArray(displayValues)) {
      displayValues = [displayValues];
    }

    let lastValueIndex = displayValues.length - 1;
    let tagNameAttributes = {
      class: `grid-comp-filter-tag-item grid-comp-filter-tag-name`,
      'data-col-id': colId,
    };

    html = `<span ${getAttributesText(tagNameAttributes)}>
        ${colData.name}:
        ${i18n(`criteria.${d.criteria}`)}
      </span>`;

    displayValues.forEach((displayValue, i) => {
      let tagValueAttributes = {
        class: `grid-comp-filter-tag-item grid-comp-filter-tag-value`,
        'data-col-id': colId,
        'data-value-index': i,
      };

      if (lastValueIndex === i) {
        tagValueAttributes.class += ' last-value';
      }

      html += `<span ${getAttributesText(tagValueAttributes)}>
          <span class="grid-comp-filter-tag-value-text" ${getTooltipAttrText(displayValue, true)}>
            ${displayValue}
          </span>

          <span class="grid-comp-icon-button grid-comp-filter-tag-remove-button" ${getTooltipAttrText(i18n('remove'))}>
            ${icon('times', { size: '12px' })}
          </span>
        </span>`;
    });

    return html;
  }

  renderSelectedRowsActionsBox() {
    let checkboxData = {
      id: `grid-comp-selectable-col-head-checkbox-${this.uniqueId}`,
      inputClass: 'grid-comp-selectable-col-head-checkbox',
      class: 'grid-comp-selectable-col-head-checkbox-cotainer',
    };

    let html = `
      <div class="grid-comp-selected-rows-clear-container">
        <span class="grid-comp-icon-button grid-comp-selected-rows-clear-button" ${this.getTooltipAttrText(this.i18n('clear'))}>
          ${icon('times', { size: '20px' })}
        </span>
      </div>
      ${this.renderCheckbox(checkboxData)}
      <div class="grid-comp-selected-rows-action-box-content">
        <div class="grid-comp-selected-rows-count"></div>
        <div class="grid-comp-selected-rows-actions-container"></div>
      </div>
    `;

    this.$selectedRowsActionsBoxWrapper.innerHTML = html;
    this.$selectableColHeadCheckbox = this.$wrapper.querySelector('.grid-comp-selectable-col-head-checkbox');
    this.$selectedRowsCount = this.$wrapper.querySelector('.grid-comp-selected-rows-count');
    this.$selectedRowsActionsContainer = this.$wrapper.querySelector('.grid-comp-selected-rows-actions-container');
  }

  renderSelectedRowsActions() {
    let actions = this.selectedRowsActions;

    if (Utils.isEmpty(actions)) {
      return;
    }

    let html = '';

    actions.forEach((action) => {
      let actionLabel;
      let actionValue;

      if (typeof action === 'object') {
        actionLabel = action.label;
        actionValue = action.value;
      } else {
        actionLabel = action;
        actionValue = action;
      }

      html += ` <button class="grid-comp-button grid-comp-button-secondary grid-comp-button-small grid-comp-selected-rows-action-button"
        data-action="${actionValue}">
          ${actionLabel}
        </button>`;
    });

    this.$selectedRowsActionsContainer.innerHTML = html;
  }
  /** render methods - end */

  /** render form element methods - start */
  renderDropdown(data) {
    if (this.hasVirtualSelect) {
      this.renderVirtualSelect(data);
    } else {
      this.renderNativeSelect(data);
    }
  }

  renderVirtualSelect(_data) {
    let i18n = this.i18n.bind(this);
    let data = {
      zIndex: this.tooltipZIndex,
      placeholder: i18n('VirtualSelect.placeholder'),
      noOptionsText: i18n('VirtualSelect.noOptionsText'),
      noSearchResultsText: i18n('VirtualSelect.noSearchResultsText'),
      selectAllText: i18n('VirtualSelect.selectAllText'),
      searchPlaceholderText: i18n('VirtualSelect.searchPlaceholderText'),
      clearButtonText: i18n('VirtualSelect.clearButtonText'),
    };

    Object.assign(data, _data);

    let $container = data.$container;
    let classNames = 'grid-comp-form-ele grid-comp-dropdown';

    if (data.class) {
      classNames += ' ' + data.class;
    }

    $container.innerHTML = `<div class="${classNames}"></div>`;
    data.ele = $container.querySelector('.grid-comp-dropdown');

    VirtualSelect.init(data);
  }

  renderNativeSelect(data) {
    let $container = data.$container;
    let options = '';

    let containerAttributes = {
      class: 'grid-comp-select-container',
    };

    let inputAttributes = {
      class: 'grid-comp-select grid-comp-form-ele grid-comp-dropdown',
    };

    if (data.additionalClasses) {
      containerAttributes.class += ' ' + data.additionalClasses;
    }

    if (data.class) {
      inputAttributes.class += ' ' + data.class;
    }

    if (data.multiple) {
      inputAttributes.multiple = true;
    }

    if (data.options) {
      data.options.forEach((d) => {
        options += `<option value="${d.value}">${d.label}</option>`;
      });
    }

    $container.innerHTML = `<div ${DomUtils.getAttributesText(containerAttributes)}>
        <select ${DomUtils.getAttributesText(inputAttributes)}>
          ${options}
        </select>
      </div>`;
  }

  renderCustomInput(data) {
    let type = data.type;
    let inputType = type === 'switch' ? 'checkbox' : type;
    let inputText = '';
    let containerAttributes = {
      class: `grid-comp-custom-input-container grid-comp-${type}-container`,
    };

    let inputAttributes = {
      type: inputType,
      class: `grid-comp-form-ele grid-comp-${inputType}`,
      id: data.id,
      name: data.name,
    };

    if (data.class) {
      containerAttributes.class += ' ' + data.class;
    }

    if (data.inputClass) {
      inputAttributes.class += ' ' + data.inputClass;
    }

    if (data.checked) {
      inputAttributes.checked = true;
    }

    if (data.disabled) {
      inputAttributes.disabled = true;
    }

    if (data.label) {
      inputText = `<span class="grid-comp-custom-input-text">${data.label}</span>`;
    }

    let html = `<label for="${data.id}" ${DomUtils.getAttributesText(containerAttributes)}>
        <input ${DomUtils.getAttributesText(inputAttributes)}>
        <span class="grid-comp-custom-input-button"></span>
        ${inputText}
      </label>`;

    return html;
  }

  renderSwitch(data) {
    data.type = 'switch';

    return this.renderCustomInput(data);
  }

  renderCheckbox(data) {
    data.type = 'checkbox';

    return this.renderCustomInput(data);
  }

  renderRadio(data) {
    data.type = 'radio';

    return this.renderCustomInput(data);
  }

  renderInputNumber(data) {
    data.additionalInputAttributes = {
      'data-validation-type': 'number',
    };

    if (data.allowDecimal) {
      data.additionalInputAttributes['data-validation-allow-decimal'] = true;
    }

    data.inputClass = (data.inputClass || '') + ' grid-comp-input-number grid-comp-input-filter';

    return this.renderInput(data);
  }

  renderInput(data) {
    let iconHtml = '';
    let clearButtonHtml = '';
    let getTooltipAttrText = this.getTooltipAttrText.bind(this);
    let i18n = this.i18n.bind(this);
    let containerAttributes = {
      class: 'grid-comp-input-container',
    };

    let inputAttributes = {
      type: 'text',
      class: 'grid-comp-form-ele grid-comp-input',
      id: data.id,
      name: data.name,
      placeholder: data.placeholder,
    };

    if (data.additionalInputAttributes) {
      Object.assign(inputAttributes, data.additionalInputAttributes);
    }

    if (data.class) {
      containerAttributes.class += ' ' + data.class;
    }

    if (data.inputClass) {
      inputAttributes.class += ' ' + data.inputClass;
    }

    if (data.iconName) {
      let iconPosition = data.iconPosition || 'right';
      containerAttributes.class += ` has-icon icon-position-${iconPosition}`;
      iconHtml = `<span class="grid-comp-input-icon">${icon(data.iconName, { size: config.iconSizeSmall })}</span>`;
    }

    if (data.hasClearButton) {
      clearButtonHtml = `<span class="grid-comp-icon-button grid-comp-input-clear-comp-clear" ${getTooltipAttrText(i18n('clear'))}>
          ${icon('times')}
        </span>`;
      containerAttributes.class += ' grid-comp-input-clear-comp-container';
      inputAttributes.class += ' grid-comp-input-clear-comp-input';
    }

    let html = `<div ${DomUtils.getAttributesText(containerAttributes)}>
        <input ${DomUtils.getAttributesText(inputAttributes)}>
        ${iconHtml}
        ${clearButtonHtml}
      </div>`;

    return html;
  }
  /** render form element methods - end */

  /** dom event methods - start */
  addEvents() {
    this.addEvent(document, 'click', 'onDocumentClick');
    this.addEvent(document, 'mouseup', 'onDocumentMouseUp');
    this.addEvent(document, 'keydown', 'onDocumentKeyDown');

    this.addEvent(this.$wrapper, 'mousedown touchstart', 'onWrapperMouseDown');
    this.addEvent(this.$wrapper, 'mousemove touchmove', 'onWrapperMouseMove');
    this.addEvent(this.$wrapper, 'click', 'onWrapperClick');
    this.addEvent(this.$wrapper, 'change', 'onWrapperChange');

    this.addEvent(this.$tableContainer, 'scroll', 'onTableContainerScroll');
  }

  addEvent($ele, events, method) {
    if (!$ele) {
      return;
    }

    events = Utils.removeArrayEmpty(events.split(' '));

    events.forEach((event) => {
      let eventsKey = `${method}-${event}`;
      let callback = this.events[eventsKey];

      if (!callback) {
        callback = this[method].bind(this);
        this.events[eventsKey] = callback;
      }

      DomUtils.addEvent($ele, event, callback);
    });
  }

  onChildEvent(e, methodsMapping) {
    let $ele = e.target;

    for (let className in methodsMapping) {
      if ($ele.closest('.' + className)) {
        this[methodsMapping[className]](e);
        break;
      }
    }
  }

  onDocumentClick(e) {
    let $ele = e.target;

    if (this.hasFiltersTags && !$ele.closest('.grid-comp-filters-tags-container')) {
      this.toggleFiltersTagsMoreItems(false);
    }
  }

  onDocumentMouseUp(e) {
    if (this.colResizing) {
      this.onColResizeEnd(e);
    }
  }

  onDocumentKeyDown(e) {
    let key = e.which || e.keyCode;
    let method = config.keyDownMethodMapping[key];

    if (method) {
      this[method](e);
    }
  }

  onEscPress() {
    if (this.isFiltersBoxShown()) {
      this.hideFiltersBox();
    }
  }

  onResize() {
    if (this.hasFiltersTags) {
      this.toggleFiltersTagsMoreItems(false);
    }
  }

  onWrapperMouseDown(e) {
    let $ele = e.target;

    if ($ele.closest('.grid-comp-col-resize-button')) {
      this.onColResizeStart(e);
    }
  }

  onWrapperMouseMove(e) {
    if (this.colResizing) {
      this.onColResizeMove(e);
    }
  }

  onWrapperClick(e) {
    this.onChildEvent(e, config.wrapperClickMethodsMapping);
  }

  onWrapperChange(e) {
    this.onChildEvent(e, config.wrapperChangeMethodsMapping);
  }

  onColResizeStart(e) {
    this.showColResize(e);
  }

  onColResizeMove(e) {
    this.moveColResize(e);
  }

  onColResizeEnd() {
    this.resizeColumn();
    this.hideColResize();
  }

  onColSortClick(e) {
    this.setSortValue(e.target);
  }

  onFiltersButtonClick() {
    this.showFiltersBox();
  }

  onFiltersBoxCancelButtonClick() {
    this.hideFiltersBox();
  }

  onPageNavFirstClick(e) {
    if (this.isEleDisabled(e)) {
      return;
    }

    this.goToPage('first');
  }

  onPageNavLastClick(e) {
    if (this.isEleDisabled(e)) {
      return;
    }

    this.goToPage('last');
  }

  onPageNavPrevClick(e) {
    if (this.isEleDisabled(e)) {
      return;
    }

    this.goToPage('prev');
  }

  onPageNavNextClick(e) {
    if (this.isEleDisabled(e)) {
      return;
    }

    this.goToPage('next');
  }

  onPerPageDropdownChange() {
    let pageDetails = this.pageDetails;
    pageDetails.page = 1;
    this.newPageDetails = pageDetails;

    this.rerenderRows();
  }

  onGrandTotalButtonClick() {
    this.getGrandTotal();
  }

  onSettingsPopoverValueChange() {
    DomUtils.addClass(this.$settingsPopover, 'has-value-changed');
  }

  onSettingsPopoverSwitchChange() {
    this.onSettingsPopoverValueChange();
  }

  onSettingsPopoverSaveClick() {
    this.saveColumnsSettings();
  }

  onSettingsPopoverCancelClick() {
    this.renderSettingsColumnItems();
    this.$settingsButton.hide();
    DomUtils.removeClass(this.$settingsPopover, 'has-value-changed');
  }

  onFiltersTagsMoreButtonClick() {
    this.toggleFiltersTagsMoreItems();
  }

  onExportButtonClick(e) {
    this.exportRows(e.target);
  }

  onTableContainerScroll() {
    this.setTableColumnShadow();
  }

  onSelectableColCheckboxChange(e) {
    let $ele = e.target;
    let $row = $ele.closest('.grid-comp-row');
    let isChecked = DomUtils.getInputValue($ele);
    let rowIndex = DomUtils.getData($row, 'rowIndex');

    DomUtils.toggleClass($row, 'selected', isChecked);
    this.setRowProp(rowIndex, 'isRowSelected', isChecked);
    this.toggleSelectedRowsActionsBox(null, { silent: true });
  }

  onSelectableColHeadCheckboxChange(e) {
    this.toggleSelectAllRows(DomUtils.getInputValue(e.target));
  }

  onSelectedRowsClearClick() {
    this.toggleSelectAllRows(false);
  }

  onSelectedRowsActionClick(e) {
    let action = DomUtils.getData(e.target, 'action');
    let selectedRows = this.getSelectedRows();

    alert(`Clicked action "${action}" for ${selectedRows.length} rows`);
  }
  /** dom event methods - end */

  /** before event methods - start */
  beforeGetRows() {
    this.toggleRowsLoader(true);
    this.setPageDetails();
  }

  beforeGetGrandTotal() {
    DomUtils.removeClass(this.$grandTotalContainer, 'has-grand-total');
    DomUtils.addClass(this.$grandTotalContainer, 'getting-grand-total');
  }

  beforeSetRows() {
    this.setPageDetails();
  }

  beforeShowFiltersBox() {
    this.setFiltersFormValue();
  }
  /** before event methods - end */

  /** after event methods - start */
  afterRenderWrapper() {
    this.setWrapperProps();
    this.renderHeader();
    this.renderFooter();
    this.setVisibleColumns();
    this.setBodyHeight();
    this.setTableColumnShadow();

    if (this.showFilters) {
      this.renderFiltersBox();
    }

    if (this.showSettings) {
      this.renderSettingsPopover();
    }

    if (this.showSelectableCol) {
      this.renderSelectedRowsActionsBox();
      this.renderSelectedRowsActions();
    }

    if (this.rowsFromServer) {
      this.getRows();
    } else {
      this.setRows(this.rows);
    }

    FiltersUtils.addTagsEvents(this.$filtersTagsContainer);
    DomUtils.initMoreShadowScroll(this.$filtersBoxFilterSections);

    DomUtils.initAccordionComp({
      $container: this.$filtersBoxFilterSections,
      afterOpen: this.afterFilterSectionOpen.bind(this),
      afterClose: this.afterFilterSectionClose.bind(this),
    });
  }

  afterRenderFooter() {
    this.renderPerPageDropdown();
  }

  afterRenderTHead() {
    this.setColumnsWidth();
  }

  afterRenderRows() {
    this.setColumnsWidth();
    this.scrollToTop();

    DomUtils.toggleClass(this.$wrapper, 'has-no-rows', this.rows.length === 0);
  }

  afterRenderSettingsPopover() {
    this.renderSettingsColumnItems();
    this.initSettingsPopover();
    DomUtils.initMoreShadowScroll(this.$settingsPopoverBodyContent);
    DomUtils.initSearchComp(this.$settingsPopover);
    DomUtils.initInputClearComp(this.$settingsPopover);

    DomUtils.initSortableComp({
      $container: this.$settingsPopover.querySelector('.sortable-comp-container'),
      afterSort: this.afterSortSettingsColumns.bind(this),
    });
  }

  afterRenderFiltersBox() {
    let $filtersBoxWrapper = this.$filtersBoxWrapper;
    let filtersValue = this.getFiltersValue();

    this.renderFilterTypeDropdowns();
    this.renderFilterFields();
    this.setInputFilter($filtersBoxWrapper);
    FiltersUtils.addEvents($filtersBoxWrapper);

    if (Utils.isNotEmpty(filtersValue)) {
      this.renderFiltersTags();
    }
  }

  afterRenderFiltersTags() {
    this.setBodyHeight();
    this.toggleFiltersTagsMoreItems(false);
  }

  afterGetRows(rows, pageDetails) {
    let oldPageDetails = this.pageDetails;

    if (!pageDetails.grandTotal) {
      if (oldPageDetails.grandTotal) {
        pageDetails.grandTotal = oldPageDetails.grandTotal;
      } else if (!pageDetails.hasNextPage) {
        /** if it is last page, we could calculate grandTotal */
        pageDetails.grandTotal = (pageDetails.page - 1) * pageDetails.perPage + rows.length;
      }
    }

    this.newPageDetails = pageDetails;

    this.setRows(rows);
    this.toggleRowsLoader(false);
  }

  afterGetGrandTotal(grandTotal) {
    this.pageDetails.grandTotal = grandTotal;

    this.renderGrandTotal();
    DomUtils.removeClass(this.$grandTotalContainer, 'getting-grand-total');
  }

  afterSetProps() {
    this.setColumns(this.columns);
    this.setColumnsDetailsFromStorage();
    this.setI18n();
  }

  afterSetVisibleColumns() {
    this.renderTHead();
  }

  afterSetVisibleRows() {
    this.renderRows();
    this.renderRowsCount();
    this.toggleFooterContent();
  }

  afterSetColumnsWidth() {
    this.setStickyPosition();
  }

  afterSetRows(data = {}) {
    if (data.resetPageDetails) {
      this.setPageDetails();
    }

    this.setVisibleRows();

    if (this.showSelectableCol) {
      this.toggleSelectedRowsActionsBox(false, { silent: true });
    }
  }

  afterSetSortValue() {
    let pageDetails = this.pageDetails;
    pageDetails.page = 1;
    this.newPageDetails = pageDetails;

    this.renderSortIcons();

    if (this.rowsFromServer) {
      this.sortRows();
    } else {
      this.sortRowsSync();
    }
  }

  afterSetPageDetails() {
    this.renderGrandTotal();
    this.togglePageNavButtons();
  }

  afterSetFiltersValue() {
    this.renderFiltersTags();
    this.filterRows();
  }

  afterSaveColumnsSettings() {
    this.setVisibleColumns();
    this.renderRows();
    this.storageSetColumnSettings();
    this.$settingsButton.hide();
    DomUtils.removeClass(this.$settingsPopover, 'has-value-changed');
  }

  afterSortRowsSync(sortedRows) {
    this.setRows(sortedRows, {
      isOldRows: true,
    });
  }

  afterShowSettingsPopover() {
    DomUtils.focusEle(this.$settingsPopoverSearchInput);
    DomUtils.toggleMoreShadow(this.$settingsPopoverBodyContent);
  }

  afterShowFiltersBox() {
    DomUtils.toggleMoreShadow(this.$filtersBoxFilterSections);
  }

  afterFilterSectionOpen($filterSection) {
    let $valueInput = $filterSection.querySelector('.grid-comp-filter-value-ele');

    DomUtils.focusEle($valueInput);
    DomUtils.toggleMoreShadow(this.$filtersBoxFilterSections);
  }

  afterFilterSectionClose() {
    DomUtils.toggleMoreShadow(this.$filtersBoxFilterSections);
  }

  afterFilterTypesChange(e) {
    /** empty method */
  }

  afterFilterValueChange(e) {
    /** empty method */
  }

  afterClearFilterValue(e) {
    /** empty method */
  }

  afterResetFiltersValue(e) {
    /** empty method */
  }

  afterSubmitFiltersValue() {
    this.setFiltersValue();
    this.hideFiltersBox();
  }

  afterSortSettingsColumns() {
    this.onSettingsPopoverValueChange();
  }
  /** after event methods - end */

  /** set methods - start */
  setProps(options) {
    options = this.setDefaultProps(options);
    this.setPropsFromElementAttr(options);

    let convertToBoolean = Utils.convertToBoolean;
    let minZIndex = config.minZIndex;

    this.$ele = options.ele;
    this.title = options.title;
    this.columns = options.columns;
    this.filtersValue = options.filtersValue;
    this.heightOffset = options.heightOffset;
    this.perPageOptions = options.perPageOptions;
    this.uniqueKey = options.uniqueKey;
    this.apiUrl = options.apiUrl;
    this.selectedRowsActions = options.selectedRowsActions;
    this.theme = options.theme.toLowerCase();
    this.language = options.language.toLowerCase();
    this.scrollableContent = convertToBoolean(options.scrollableContent);
    this.rowsFromServer = convertToBoolean(options.rowsFromServer);
    this.resizable = convertToBoolean(options.resizable);
    this.sortable = convertToBoolean(options.sortable);
    this.exportable = convertToBoolean(options.exportable);
    this.hideHeader = convertToBoolean(options.hideHeader);
    this.showFilters = convertToBoolean(options.showFilters);
    this.showSettings = convertToBoolean(options.showSettings);
    this.disableLocalstorage = convertToBoolean(options.disableLocalstorage);
    this.showSerialNumberCol = convertToBoolean(options.showSerialNumberCol);
    this.showSelectableCol = convertToBoolean(options.showSelectableCol);
    this.tooltipFontSize = options.tooltipFontSize;
    this.tooltipAlignment = options.tooltipAlignment;
    this.tooltipEnterDelay = parseInt(options.tooltipEnterDelay);

    this.hasVirtualSelect = typeof VirtualSelect !== 'undefined';
    this.uniqueId = this.getUniqueId();
    this.filtersTagsHeight = parseFloat(config.filtersTagsHeight);
    this.tooltipZIndex = minZIndex + 9;
    this.popoverZIndex = minZIndex + 9;
    this.events = {};
    this.visibleColumns = [];
    this.visibleRows = [];
    this.colMinWidth = 50;

    if (!this.rowsFromServer) {
      this.rows = options.rows || [];
    }

    this.afterSetProps();
  }

  setDefaultProps(options) {
    let defaultOptions = {
      scrollableContent: true,
      rowsFromServer: true,
      resizable: true,
      sortable: false,
      exportable: false,
      hideHeader: false,
      showFilters: false,
      showSettings: false,
      disableLocalstorage: false,
      showSerialNumberCol: false,
      showSelectableCol: false,
      perPageOptions: [25, 50, 100],
      theme: 'light',
      language: 'default',
      tooltipFontSize: '14px',
      tooltipAlignment: 'center',
      tooltipEnterDelay: 200,
      filtersValue: [],
    };

    return Object.assign(defaultOptions, options);
  }

  setPropsFromElementAttr(options) {
    let $ele = options.ele;
    let mapping = {
      'data-scrollable-content': 'scrollableContent',
      'data-rows-from-server': 'rowsFromServer',
      'data-unique-key': 'uniqueKey',
      'data-api-url': 'apiUrl',
      'data-resizable': 'resizable',
      'data-sortable': 'sortable',
      'data-exportable': 'exportable',
      'data-hide-header': 'hideHeader',
      'data-show-filters': 'showFilters',
      'data-show-settings': 'showSettings',
      'data-disable-localstorage': 'disableLocalstorage',
      'data-show-serial-number-col': 'showSerialNumberCol',
      'data-show-selectable-col': 'showSelectableCol',
      'data-theme': 'theme',
      'data-language': 'default',
      'data-tooltip-font-size': 'tooltipFontSize',
      'data-tooltip-alignment': 'tooltipAlignment',
      'data-tooltip-enter-delay': 'tooltipEnterDelay',
    };

    for (let k in mapping) {
      let value = $ele.getAttribute(k);

      if (value) {
        options[mapping[k]] = value;
      }
    }
  }

  setWrapperProps() {
    this.$ele.gridComp = this;
    this.$wrapper.gridComp = this;
  }

  setI18n() {
    let language = this.language;
    let i18nData = Object.assign({}, i18n.default);

    if (language !== 'default') {
      i18nData = Object.assign(i18nData, i18n[language]);
    }

    this.i18nData = i18nData;
  }

  setColumns(columns = []) {
    let convertToBoolean = Utils.convertToBoolean;
    let resizable = this.resizable;
    let sortable = this.sortable;

    this.columns = columns.map((data, i) => {
      let d = Object.assign({}, data);
      d.index = i;
      d.resizable = convertToBoolean(d.resizable, resizable);
      d.sortable = convertToBoolean(d.sortable, sortable);

      if (d.filter) {
        if (typeof d.filter !== 'object') {
          d.filter = {};
        }

        if (!d.filter.type) {
          d.filter.type = 'text';
        }
      }

      return d;
    });
  }

  setVisibleColumns() {
    let visibleColumns = [];
    let index = 0;
    let nextColumnIndex = this.columns.length;

    if (this.showSelectableCol) {
      visibleColumns.push(
        this.getSelectableColDetails({
          index: nextColumnIndex,
        })
      );

      nextColumnIndex++;
    }

    if (this.showSerialNumberCol) {
      visibleColumns.push(
        this.getSerialNumberColDetails({
          index: nextColumnIndex,
        })
      );

      nextColumnIndex++;
    }

    visibleColumns = [...visibleColumns, ...this.columns];

    visibleColumns = visibleColumns.filter((d) => {
      let isVisible = !d.hidden;

      d.isFirst = false;
      d.isLast = false;
      d.visibleIndex = index;

      if (isVisible) {
        index++;
      }

      return isVisible;
    });

    let visibleColumnsLength = visibleColumns.length;

    if (visibleColumnsLength) {
      visibleColumns[0].isFirst = true;
      visibleColumns[visibleColumnsLength - 1].isLast = true;
    }

    this.visibleColumns = visibleColumns;

    this.afterSetVisibleColumns();
  }

  setRows(rows, data = {}) {
    this.beforeSetRows();

    let isRowSelectable = this.isRowSelectable.bind(this);
    this.rows = rows || [];

    /** setting extra properties */
    this.rows.forEach((d, i) => {
      d.rowIndex = i;

      let isRowSelectableResult = isRowSelectable(d);

      if (typeof isRowSelectableResult === 'object') {
        d.isRowSelectable = isRowSelectableResult.result;
        d.isRowSelectableMessage = isRowSelectableResult.message;
      } else {
        d.isRowSelectable = isRowSelectableResult;
      }
    });

    if (!data.isOldRows) {
      this.originalRows = [...this.rows];
    }

    this.afterSetRows(data);
  }

  setVisibleRows() {
    let visibleRows = [...this.rows];

    if (!this.rowsFromServer) {
      let pageDetails = this.pageDetails;
      let perPage = pageDetails.perPage;
      let startIndex = (pageDetails.page - 1) * perPage;

      visibleRows = visibleRows.splice(startIndex, perPage);
    }

    this.visibleRows = visibleRows;

    let rowsRange = this.getRowsRange();
    let visibleRowIndex = rowsRange.start;

    /** setting extra properties */
    this.visibleRows.forEach((d) => {
      d.sNo = visibleRowIndex++;
    });

    this.afterSetVisibleRows();
  }

  setBodyHeight() {
    if (!this.scrollableContent) {
      return;
    }

    let heightOffset = this.heightOffset;
    let extraOffset = parseFloat(config.footerHeight);
    let offset = '';

    if (heightOffset) {
      offset += ` - ${heightOffset}`;
    }

    if (!this.hideHeader) {
      extraOffset += parseFloat(config.headerHeight);
    }

    if (this.hasFiltersTags) {
      extraOffset += this.filtersTagsHeight;
    }

    offset += ` - ${extraOffset}px`;

    DomUtils.addClass(this.$wrapper, 'scrollabel-content');
    DomUtils.setStyle(this.$tableContainer, 'height', `calc(100vh${offset})`);
  }

  setColumnsWidth(params = {}) {
    if (!this.$columns) {
      return;
    }

    let colIndex = params.colIndex;
    let newWidth = params.newWidth;
    let hasColIndex = colIndex !== undefined;

    this.$columns.forEach(($col) => {
      let _colIndex = DomUtils.getData($col, 'index', 'number');

      if (hasColIndex && _colIndex !== colIndex) {
        return;
      }

      let $colContent = $col.querySelector('.grid-comp-col-content');
      let width = hasColIndex ? newWidth : DomUtils.getData($col, 'width');

      if (width) {
        DomUtils.setStyle($colContent, 'width', width);
        DomUtils.setData($col, 'width', width);
      } else {
        DomUtils.setData($col, 'width', $colContent.clientWidth + 'px');
      }
    });

    this.afterSetColumnsWidth();
  }

  setStickyPosition() {
    let wrapperCoords = this.$wrapper.getBoundingClientRect();
    let wrapperLeft = wrapperCoords.left;
    let scrollLeft = this.$tableContainer.scrollLeft;

    this.$wrapper.querySelectorAll('.grid-comp-col-sticky:not(.first-child)').forEach(($ele) => {
      DomUtils.setStyle($ele, 'left', 'auto');

      let coords = $ele.getBoundingClientRect();
      let newLeft = coords.left - wrapperLeft + scrollLeft;

      DomUtils.setStyle($ele, 'left', `${newLeft}px`);
    });
  }

  setSortValue($ele) {
    let $col = $ele.closest('.grid-comp-col');
    let newIndex = DomUtils.getData($col, 'index');
    let sortColOrderAsc = true;

    /** on clicking same column */
    if (newIndex === this.sortColIndex) {
      sortColOrderAsc = !this.sortColOrderAsc;
    } else {
      this.sortColIndex = newIndex;
    }

    this.sortColOrderAsc = sortColOrderAsc;

    this.afterSetSortValue();
  }

  setPageDetails() {
    let data = this.newPageDetails || {};
    let perPage = parseInt(this.$perPageDropdown.value);
    let pageDetails = {
      page: data.page || 1,
      perPage,
      grandTotal: data.grandTotal || 0,
      hasNextPage: data.hasNextPage !== undefined ? data.hasNextPage : false,
    };

    if (!this.rowsFromServer) {
      let grandTotal = this.rows.length;
      pageDetails.grandTotal = grandTotal;
      pageDetails.hasNextPage = pageDetails.grandTotal > pageDetails.page * pageDetails.perPage;
      pageDetails.totalPages = Math.ceil(grandTotal / perPage);
    }

    this.pageDetails = pageDetails;
    this.newPageDetails = null;

    this.afterSetPageDetails();
  }

  setColDetails(index, key, value) {
    let colDetails = this.columns[index];

    if (colDetails) {
      colDetails[key] = value;
    }
  }

  setColumnsHiddenProp() {
    let columns = this.columns;
    let uniqueId = this.uniqueId;

    columns.forEach((d) => {
      let $switch = this.$wrapper.querySelector(`#grid-comp-settings-column-item-switch-${uniqueId}-${d.id}`);

      if ($switch) {
        d.hidden = !DomUtils.getInputValue($switch);
      }
    });
  }

  setColumnsOrder(columnsOrder) {
    if (columnsOrder) {
      this.columnsOrder = columnsOrder;
      return;
    }

    columnsOrder = [];
    let getData = DomUtils.getData;

    /** pushing sticky column first */
    this.columns.forEach((d) => {
      if (d.sticky) {
        columnsOrder.push(d.id);
      }
    });

    this.$wrapper.querySelectorAll('.grid-comp-settings-column-item').forEach(($ele) => {
      columnsOrder.push(getData($ele, 'colId'));
    });

    this.columnsOrder = columnsOrder;
  }

  setColumnsDetailsFromStorage() {
    let storageDetails = this.getColumnsDetailsFromStorage();
    let columnWidthMapping = Utils.objectDeepGet(storageDetails, 'columnWidthMapping');
    let columnSettings = Utils.objectDeepGet(storageDetails, 'columnSettings');
    let hiddenMapping;
    let columnsOrder;

    if (columnSettings) {
      hiddenMapping = columnSettings.hiddenMapping;
      columnsOrder = columnSettings.columnsOrder;
    }

    if (columnsOrder) {
      this.setColumnsOrder(columnsOrder);
      this.sortColumns();
    }

    this.columns.forEach((d) => {
      let id = d.id;

      /** overriding hidden prop value from storage */
      if (hiddenMapping && hiddenMapping[id] !== undefined) {
        d.hidden = hiddenMapping[id];
      }

      /** overriding width prop value from storage */
      if (columnWidthMapping && columnWidthMapping[id] !== undefined) {
        d.width = columnWidthMapping[id];
      }
    });
  }

  setInputFilter($container) {
    if (!$container) {
      return;
    }

    DomUtils.setInputFilter($container.querySelectorAll('.grid-comp-input-filter'));
  }

  setFiltersValue(filtersValue) {
    if (!filtersValue) {
      filtersValue = FiltersUtils.getFiltersValue(this);
    }

    this.filtersValue = filtersValue;

    this.afterSetFiltersValue();
  }

  setFiltersFormValue() {
    let filtersValue = this.getFiltersValue();

    return FiltersUtils.setFiltersValue(this, filtersValue);
  }

  setFiltersDisplayValue(filtersValue) {
    return FiltersUtils.setFiltersDisplayValue(this, filtersValue);
  }

  setFiltersValueInReqData(reqData) {
    let filtersValue = this.getFiltersValue();

    filtersValue.forEach((d) => {
      reqData[`${d.key}[${d.criteria}]`] = d.value;
    });
  }

  setTableColumnShadow() {
    let $tableContainer = this.$tableContainer;
    let scrollLeft = $tableContainer.scrollLeft;
    let hasLeftColumn = scrollLeft > 0;
    let hasRightColumn = $tableContainer.scrollWidth > $tableContainer.clientWidth + scrollLeft;

    DomUtils.toggleClass(this.$wrapper, 'has-left-column', hasLeftColumn);
    DomUtils.toggleClass(this.$wrapper, 'has-right-column', hasRightColumn);
  }

  setRowProp(index, name, value) {
    let rowData = this.rows[index];

    if (rowData) {
      rowData[name] = value;
    }
  }
  /** set methods - end */

  /** get methods - start */
  getRows() {
    this.beforeGetRows();
  }

  getReqData(data = {}) {
    let type = data.type || 'rows';
    let reqData = {};

    if (this.apiUrl) {
      reqData.apiUrl = this.apiUrl;
    }

    if (type === 'rows') {
      let pageDetails = this.pageDetails;
      reqData.page = pageDetails.page;
      reqData.perPage = pageDetails.perPage;

      /** setting sort details */
      if (this.sortColIndex) {
        let colDetails = this.getColDetailsByIndex(this.sortColIndex);
        reqData.sortBy = colDetails.key;
        reqData.sortOrder = this.getSortOrderText();
      }
    } else if (type === 'grandTotal') {
      reqData.type = 'grandTotal';
    }

    this.setFiltersValueInReqData(reqData);

    return reqData;
  }

  getReqDataForGrandTotal() {
    return this.getReqData({
      type: 'grandTotal',
    });
  }

  getTooltipAttrText(text, ellipsisOnly = false, allowHtml = false) {
    let data = {
      'data-tooltip': text || '',
      'data-tooltip-z-index': this.tooltipZIndex,
      'data-tooltip-enter-delay': this.tooltipEnterDelay,
      'data-tooltip-font-size': this.tooltipFontSize,
      'data-tooltip-alignment': this.tooltipAlignment,
      'data-tooltip-ellipsis-only': ellipsisOnly,
      'data-tooltip-allow-html': allowHtml,
      'data-tooltip-additional-classes': `grid-comp-tooltip`,
    };

    return DomUtils.getAttributesText(data);
  }

  getCoordsInWrapper($ele) {
    if (!$ele) {
      return;
    }

    let wrapperCoords = this.$wrapper.getBoundingClientRect();
    let eleCoords = $ele.getBoundingClientRect();

    return {
      left: eleCoords.left - wrapperCoords.left,
      top: eleCoords.top - wrapperCoords.top,
      right: eleCoords.right - wrapperCoords.left,
    };
  }

  getColWidth(pixel) {
    let fullWidth = this.$tableContainer.clientWidth;
    let percentage = (fullWidth / parseFloat(pixel)) * 100;

    return percentage;
  }

  getColDetailsByIndex(index, key) {
    let result = this.columns[index];

    if (key && result) {
      result = Utils.objectDeepGet(result, key);
    }

    return result;
  }

  getColDetailsById(id, key) {
    let result = Utils.findArrayOfObject(this.columns, 'id', id);

    if (key && result) {
      result = Utils.objectDeepGet(result, key);
    }

    return result;
  }

  getSortOrderText() {
    return this.sortColOrderAsc ? 'asc' : 'desc';
  }

  getPerPageOptions() {
    let result = [];

    this.perPageOptions.forEach((d) => {
      result.push({
        value: d,
        label: `${d} ${this.i18n('records.per.page')}`,
      });
    });

    return result;
  }

  getGrandTotal() {
    this.beforeGetGrandTotal();
  }

  getRowsRange() {
    let pageDetails = this.pageDetails;
    let totalRows = this.visibleRows.length;
    let hasRows = totalRows ? true : false;
    let start = 0;
    let end = 0;

    if (hasRows) {
      start = pageDetails.perPage * (pageDetails.page - 1) + 1;
      end = start + totalRows - 1;
    }

    return { start, end };
  }

  getUniqueId() {
    let uniqueId = Utils.getRandomInt(100);
    let isAlreadyUsed = document.querySelector(`.grid-comp-wrapper[data-unique-id="${uniqueId}"]`);

    if (isAlreadyUsed) {
      return this.getUniqueId();
    } else {
      return uniqueId;
    }
  }

  getSelectableColDetails(params = {}) {
    let details = Object.assign({}, config.specialColumns.selectable);
    details.index = params.index;

    return details;
  }

  getSerialNumberColDetails(params = {}) {
    let details = Object.assign({}, config.specialColumns.sNo);
    details.index = params.index;

    return details;
  }

  getColumnHiddenMapping() {
    let result = {};

    this.columns.forEach((d) => {
      if (d.hidden !== undefined) {
        result[d.id] = d.hidden;
      }
    });

    return result;
  }

  getColumnsOrder() {
    return this.columnsOrder;
  }

  getColumnsDetailsFromStorage() {
    return this.storageGet(null, true);
  }

  getFilterKey(colData) {
    return Utils.objectDeepGet(colData, 'filter.key') || colData.key;
  }

  getFiltersValue() {
    let filtersValue = this.filtersValue;

    return filtersValue || [];
  }

  getSelectedOptionsDisplayValue(options, value) {
    return Utils.getSelectedOptionsDisplayValue(options, value);
  }

  getSelectedRows(propName) {
    let selectedRows = this.rows.filter((d) => d.isRowSelected);

    if (propName) {
      selectedRows = selectedRows.map((d) => d[propName]);
    }

    return selectedRows;
  }

  getSelectedRowsCount() {
    let selectedRows = this.getSelectedRows();

    return selectedRows ? selectedRows.length : 0;
  }
  /** get methods - end */

  /** storage methods - start */
  storageGet(key, currentGrid) {
    if (!this.uniqueKey || this.disableLocalstorage) {
      return;
    }

    let value = StorageUtils.get('gridComp', 'object');

    if (key) {
      value = Utils.objectDeepGet(value, `${this.uniqueKey}.${key}`);
    } else if (currentGrid) {
      value = Utils.objectDeepGet(value, this.uniqueKey);
    }

    return value;
  }

  storageGetColumnWidth() {
    return this.storageGet('columnWidthMapping');
  }

  storageSet(key, value) {
    if (!this.uniqueKey || this.disableLocalstorage) {
      return;
    }

    let storageObj = this.storageGet();
    storageObj = Utils.objectDeepSet(storageObj, `${this.uniqueKey}.${key}`, value);

    StorageUtils.set('gridComp', storageObj);
  }

  storageSetColumnSettings() {
    let columnSettings = {
      hiddenMapping: this.getColumnHiddenMapping(),
      columnsOrder: this.getColumnsOrder(),
    };

    this.storageSet('columnSettings', columnSettings);
  }

  storageSetColumnWidth(colId, width) {
    let columnWidthMapping = this.storageGetColumnWidth() || {};
    columnWidthMapping[colId] = width;

    this.storageSet('columnWidthMapping', columnWidthMapping);
  }
  /** storage methods - end */

  i18n(key, ...replaceArray) {
    return Utils.i18n(this.i18nData, key, replaceArray);
  }

  showColResize(e) {
    let $col = e.target.closest('.grid-comp-col');
    let coords = this.getCoordsInWrapper($col);
    let left = coords.right - 8; /** 8 - half width of resize button */
    let currentWidth = DomUtils.getData($col, 'width', 'number');
    let columnId = DomUtils.getData($col, 'columnId');

    DomUtils.setStyle(this.$resizingLine, 'left', `${left}px`);
    DomUtils.setData(this.$resizingLine, 'translateLeft', 0);
    DomUtils.setData(this.$resizingLine, 'currentWidth', currentWidth);
    DomUtils.setData(this.$resizingLine, 'columnId', columnId);

    DomUtils.addClass(this.$wrapper, 'col-resizing');
    this.colResizing = true;
    this.colResizingIndex = DomUtils.getData($col, 'index', 'number');
  }

  moveColResize(e) {
    let colMinWidth = this.colMinWidth;
    let currentWidth = DomUtils.getData(this.$resizingLine, 'currentWidth', 'number');
    let translateLeft = DomUtils.getData(this.$resizingLine, 'translateLeft', 'number');
    translateLeft = translateLeft + e.movementX;
    let newWidth = currentWidth + translateLeft;

    if (newWidth < colMinWidth) {
      translateLeft = colMinWidth - currentWidth;
    }

    DomUtils.setStyle(this.$resizingLine, 'transform', `translate3d(${translateLeft}px, 0, 0)`);
    DomUtils.setData(this.$resizingLine, 'translateLeft', translateLeft);
  }

  resizeColumn() {
    let currentWidth = DomUtils.getData(this.$resizingLine, 'currentWidth', 'number');
    let translateLeft = DomUtils.getData(this.$resizingLine, 'translateLeft', 'number');
    let columnId = DomUtils.getData(this.$resizingLine, 'columnId');
    let newWidth = currentWidth + translateLeft + 'px';
    let colIndex = this.colResizingIndex;

    this.setColDetails(colIndex, 'width', newWidth);
    this.setColumnsWidth({ colIndex, newWidth });
    this.storageSetColumnWidth(columnId, newWidth);
  }

  hideColResize() {
    DomUtils.setStyle(this.$resizingLine, 'left', 0);
    DomUtils.setStyle(this.$resizingLine, 'transform', `translate3d(0, 0, 0)`);
    DomUtils.removeClass(this.$wrapper, 'col-resizing');
    this.colResizing = false;
    this.colResizingIndex = -1;
  }

  sortRows() {
    this.getRows();
  }

  sortRowsSync() {
    let sortColKey = this.getColDetailsByIndex(this.sortColIndex, 'key');
    let sortedRows = Utils.sortArrayOfObject(this.originalRows, sortColKey, !this.sortColOrderAsc, true);

    this.afterSortRowsSync(sortedRows);
  }

  sortColumns() {
    let columns = [];
    let columnsOrder = this.getColumnsOrder();
    let columnsObj = Utils.convertArrayToObject(this.columns);

    columnsOrder.forEach((id) => {
      columns.push(columnsObj[id]);
    });

    this.columns = columns;
  }

  scrollToTop() {
    let scrollTop = this.$tableContainer.scrollTop;

    if (scrollTop > 0) {
      this.$tableContainer.scrollTop = 0;
    }
  }

  goToPage(action) {
    let pageDetails = this.pageDetails;

    if (action === 'prev' && pageDetails.page !== 1) {
      pageDetails.page--;
    } else if (action === 'next' && pageDetails.hasNextPage) {
      pageDetails.page++;
    } else if (action === 'first') {
      pageDetails.page = 1;
    } else if (action === 'last') {
      pageDetails.page = pageDetails.totalPages || -1;
    }

    this.newPageDetails = pageDetails;

    this.rerenderRows();
  }

  rerenderRows() {
    if (this.rowsFromServer) {
      this.getRows();
    } else {
      this.setPageDetails();
      this.setVisibleRows();
    }
  }

  togglePageNavButtons() {
    let pageDetails = this.pageDetails;
    let isFirstPage = pageDetails.page === 1;
    let hasNextPage = pageDetails.hasNextPage;

    DomUtils.toggleClass(this.$pageNavFirst, 'disabled', isFirstPage);
    DomUtils.toggleClass(this.$pageNavPrev, 'disabled', isFirstPage);
    DomUtils.toggleClass(this.$pageNavNext, 'disabled', !hasNextPage);
    DomUtils.toggleClass(this.$pageNavLast, 'disabled', !hasNextPage);
  }

  isEleDisabled(e) {
    return DomUtils.hasClass(e.target, 'disabled');
  }

  show($ele) {
    DomUtils.removeClass($ele, 'grid-comp-hide');
  }

  hide($ele) {
    DomUtils.addClass($ele, 'grid-comp-hide');
  }

  toggle($ele, isVisible) {
    DomUtils.toggleClass($ele, 'grid-comp-hide', !isVisible);
  }

  toggleRowsLoader(show) {
    DomUtils.toggleClass(this.$wrapper, 'getting-rows', show);
  }

  toggleFooterContent() {
    let noRows = this.pageDetails.page === 1 && !this.visibleRows.length;

    this.toggle(this.$footerRight, !noRows);
  }

  toggleFiltersTagsVisibleItems() {
    let $filterTagItems = DomUtils.reverse(this.$filterTagItems);
    let $filtersTagsContainer = this.$filtersTagsContainer;
    let filtersTagsHeight = this.filtersTagsHeight;
    let hasMoreFiltersTags = false;
    let show = this.show.bind(this);
    let hide = this.hide.bind(this);

    show($filterTagItems);

    $filterTagItems.forEach(($filterTagItem) => {
      /** if coming in second row */
      if ($filtersTagsContainer.offsetHeight > filtersTagsHeight) {
        hasMoreFiltersTags = true;

        hide($filterTagItem);
      }
    });

    DomUtils.toggleClass(this.$wrapper, 'has-more-filters-tags', hasMoreFiltersTags);
  }

  toggleFiltersTagsMoreItems(show) {
    if (typeof show === 'undefined') {
      show = !DomUtils.hasClass(this.$wrapper, 'show-more-filters-tags');
    }

    if (show) {
      this.show(this.$filterTagItems);
    } else {
      this.toggleFiltersTagsVisibleItems();
    }

    DomUtils.toggleClass(this.$wrapper, 'show-more-filters-tags', show);
  }

  isRowSelectable(rowData) {
    return true;
  }

  isAllRowsSelected() {
    /** if any row is not selected, stop the loop and return false */
    return !this.rows.some((d) => {
      return !d.isRowSelected && d.isRowSelectable;
    });
  }

  toggleSelectAllRows(isChecked) {
    if (typeof isChecked !== 'boolean') {
      isChecked = this.isAllRowsSelected();
    }

    let setInputValue = DomUtils.setInputValue;

    this.$selectableColCheckbox.forEach(($ele) => {
      if ($ele.disabled) {
        return;
      }

      setInputValue($ele, isChecked, { skipIfSameValue: true });
    });
  }

  toggleSelectedRowsActionsBox(isAllRowsSelected, params = {}) {
    if (typeof isAllRowsSelected !== 'boolean') {
      isAllRowsSelected = this.isAllRowsSelected();
    }

    let selectedRowsCount = this.getSelectedRowsCount();
    let hasRowsSelected = selectedRowsCount > 0;

    this.$selectedRowsCount.innerHTML = selectedRowsCount;

    DomUtils.toggleClass(this.$wrapper, 'has-rows-selected', hasRowsSelected);
    DomUtils.toggleClass(this.$selectableColHeadCheckbox, 'partial', hasRowsSelected && !isAllRowsSelected);
    DomUtils.setInputValue(this.$selectableColHeadCheckbox, isAllRowsSelected, { silent: params.silent });
  }

  initPopover(options) {
    if (typeof PopoverComponent === 'undefined') {
      return;
    }

    let popoverOptions = {
      zIndex: this.popoverZIndex,
    };

    return PopoverComponent.init(Object.assign(popoverOptions, options));
  }

  initSettingsPopover() {
    this.settingsPopover = this.initPopover({
      ele: this.$settingsButton,
      target: this.$settingsPopover,
      position: 'bottom right',
      afterShow: this.afterShowSettingsPopover.bind(this),
    });
  }

  showFiltersBox() {
    this.beforeShowFiltersBox();

    DomUtils.addClass(this.$wrapper, 'filters-box-opened');

    this.afterShowFiltersBox();
  }

  hideFiltersBox() {
    DomUtils.removeClass(this.$wrapper, 'filters-box-opened');
  }

  isFiltersBoxShown() {
    return DomUtils.hasClass(this.$wrapper, 'filters-box-opened');
  }

  removeFilterValue(colId, valueIndex = -1) {
    let filtersValue = this.getFiltersValue();
    let itemIndex = Utils.findArrayIndex(filtersValue, 'id', colId);

    if (valueIndex === -1) {
      filtersValue.splice(itemIndex, 1);
    } else {
      let filterValue = filtersValue[itemIndex];

      filterValue.value.splice(valueIndex, 1);
    }

    this.setFiltersValue(filtersValue);
  }

  filterRows() {
    if (this.rowsFromServer) {
      this.getRows();
    } else {
      this.filterRowsSync();
    }
  }

  filterRowsSync() {
    FiltersUtils.filterRows(this);
  }

  exportRows($button) {
    /** empty method */
  }

  saveColumnsSettings() {
    this.setColumnsOrder();
    this.sortColumns();
    this.setColumnsHiddenProp();
    this.afterSaveColumnsSettings();
  }

  /** static methods - start */
  static version() {
    return config.GridCoreVersion;
  }

  static getAllInstances() {
    let instances = [];

    document.querySelectorAll('.grid-comp-wrapper').forEach(($ele) => {
      if ($ele.gridComp) {
        instances.push($ele.gridComp);
      }
    });

    return instances;
  }

  static onResizeMethod() {
    GridCoreComponent.getAllInstances().forEach((gridComp) => {
      gridComp.onResize();
    });
  }

  static setTheme(themeName) {
    if (!themeName) {
      return;
    }

    themeName = themeName.toLowerCase();
    let $body = document.querySelector('body');
    let oldThemeName = DomUtils.getData($body, 'gridCompTheme');

    if (oldThemeName) {
      DomUtils.removeClass($body, 'grid-comp-theme-' + oldThemeName);
    }

    DomUtils.addClass($body, 'grid-comp-theme-' + themeName);
    DomUtils.setData($body, 'gridCompTheme', themeName);
  }
  /** static methods - end */
}

window.addEventListener('resize', GridCoreComponent.onResizeMethod);

window.GridCoreComponent = GridCoreComponent;
importSvgIcons();
