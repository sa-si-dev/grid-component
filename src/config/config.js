export const config = {
  GridCoreVersion: 'v1.0.2',

  headerHeight: '60px',
  filtersTagsHeight: '50px',
  footerHeight: '36px',
  minZIndex: 1,

  iconSize: '16px',
  iconSizeSmall: '14px',
  iconSizeMedium: '18px',

  colAlignMapping: {
    left: 'flex-start',
    right: 'flex-end',
    center: 'center',
  },

  keyDownMethodMapping: {
    27: 'onEscPress',
  },

  filterTypeFieldRendererMapping: {
    default: 'renderFilterFieldForText',
    number: 'renderFilterFieldForNumber',
    select: 'renderFilterFieldForSelect',
  },

  wrapperClickMethodsMapping: {
    'grid-comp-col-sort-button': 'onColSortClick',
    'grid-comp-selected-rows-clear-button': 'onSelectedRowsClearClick',
    'grid-comp-grand-total-button': 'onGrandTotalButtonClick',
    'grid-comp-settings-save-button': 'onSettingsPopoverSaveClick',
    'grid-comp-settings-cancel-button': 'onSettingsPopoverCancelClick',
    'grid-comp-filters-tags-more-button': 'onFiltersTagsMoreButtonClick',
    'grid-comp-export-button': 'onExportButtonClick',
    'grid-comp-filters-button': 'onFiltersButtonClick',
    'grid-comp-filters-box-cancel-button': 'onFiltersBoxCancelButtonClick',
    'grid-comp-page-nav-button-first': 'onPageNavFirstClick',
    'grid-comp-page-nav-button-last': 'onPageNavLastClick',
    'grid-comp-page-nav-button-prev': 'onPageNavPrevClick',
    'grid-comp-page-nav-button-next': 'onPageNavNextClick',
    'grid-comp-selected-rows-action-button': 'onSelectedRowsActionClick',
  },

  wrapperChangeMethodsMapping: {
    'grid-comp-selectable-col-checkbox': 'onSelectableColCheckboxChange',
    'grid-comp-selectable-col-head-checkbox': 'onSelectableColHeadCheckboxChange',
    'grid-comp-per-page-dropdown': 'onPerPageDropdownChange',
    'grid-comp-settings-column-item-switch': 'onSettingsPopoverSwitchChange',
  },

  specialColumns: {
    sNo: {
      id: 'sNo',
      key: 'sNo',
      name: '#',
      width: '50px',
      align: 'center',
      sticky: true,
      sortable: false,
      resizable: false,
      alwaysShow: true,
    },
    selectable: {
      id: 'selectableCheckbox',
      key: 'sNo',
      width: '20px',
      renderer: 'renderSelectableCol',
      sticky: true,
      sortable: false,
      resizable: false,
      alwaysShow: true,
    },
  },
};

window.gridCompConfig = config;
