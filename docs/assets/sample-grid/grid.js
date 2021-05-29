class GridComponent extends GridCoreComponent {
  constructor(options) {
    let defaultOptions = {
      exportable: true,
      showSerialNumberCol: true,
      showSelectableCol: true,
      selectedRowsActions: [
        { label: 'Delete', value: 'delete' },
        { label: 'Change Status', value: 'change_status' },
      ],
      // selectedRowsActions: ['Delete', 'Change Status'],
    };

    if (options.rows) {
      options.rowsFromServer = false;
    }

    super(Object.assign(defaultOptions, options));
  }

  getRows() {
    super.getRows();

    let reqData = this.getReqData();

    ApiUtils.apiCall(reqData).then((res) => {
      this.afterGetRows(res.rows, res.meta);
    });
  }

  getGrandTotal() {
    super.getGrandTotal();

    let reqData = this.getReqDataForGrandTotal();

    ApiUtils.apiCall(reqData).then((res) => {
      this.afterGetGrandTotal(res.grandTotal);
    });
  }

  exportRows() {
    alert('File would be downloaded from export API');
  }
}

class SampleGrid extends GridComponent {
  constructor() {
    let sampleGrid = ApiUtils.getGridConfig('sampleGrid');
    let options = {
      ele: '#sample-grid',
      title: sampleGrid.title,
      uniqueKey: 'sampleGrid',
      apiUrl: 'api/sample-grid',
      columns: sampleGrid.columns,
      // rows: ApiUtils.getRows(210),
      heightOffset: '110px',
      sortable: true,
      // perPageOptions: [25, 50, 100, 200],
      showFilters: true,
      showSettings: true,
      // theme: 'dArk',
      // language: 'Tamil',
    };

    super(options);
  }

  rendererEmailCol(colData, rowData) {
    let email = rowData[colData.key];
    let textTooltip = this.getTooltipAttrText(email, true);
    let html = `<a class="grid-comp-col-text" ${textTooltip} href="#/demo?email=${email}">${email}</a>`;

    return html;
  }

  rendererHiddenCol1Filter(colData, $container) {
    $container.innerHTML = 'Custom filter section for hidden column';
  }

  getSerialNumberColDetails(params = {}) {
    let details = super.getSerialNumberColDetails(params);
    details.width = '30px';

    return details;
  }

  isRowSelectable(rowData) {
    // return true;
    let rowIndex = rowData.rowIndex;
    let result = rowIndex === 0 || rowIndex % 6 !== 0;

    if (!result) {
      result = {
        result,
        message: 'No permission',
      };
    }

    return result;
  }
}
