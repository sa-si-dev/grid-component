export const config = {
  GridCoreVersion: 'v1.0.1',

  headerHeight: '60px',
  filtersTagsHeight: '50px',
  footerHeight: '36px',
  minZIndex: 1,

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
  },
};

window.gridCompConfig = config;
