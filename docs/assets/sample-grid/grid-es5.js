function GridComponent(options) {
  var defaultOptions = {
    exportable: true,
    showSerialNumberCol: true,
  };

  GridCoreComponent.prototype.constructor.call(this, Object.assign(defaultOptions, options));
}

GridComponent.prototype = Object.create(GridCoreComponent.prototype);

GridComponent.prototype.getRows = function () {
  GridCoreComponent.prototype.getRows.call(this);

  var reqData = this.getReqData();

  ApiUtils.apiCall(reqData).then((res) => {
    this.afterGetRows(res.rows, res.meta);
  });
};

GridComponent.prototype.getGrandTotal = function () {
  GridCoreComponent.prototype.getGrandTotal.call(this);

  var reqData = this.getReqDataForGrandTotal();

  ApiUtils.apiCall(reqData).then((res) => {
    this.afterGetGrandTotal(res.grandTotal);
  });
};

GridComponent.prototype.exportRows = function () {
  alert('File would be downloaded from export API');
};

function SampleGrid() {
  var sampleGrid = ApiUtils.getGridConfig('sampleGrid');
  var options = {
    ele: '#sample-grid',
    title: sampleGrid.title,
    uniqueKey: 'sampleGrid',
    columns: sampleGrid.columns,
    heightOffset: '70px',
    sortable: true,
    showFilters: true,
    showSettings: true,
  };

  GridComponent.prototype.constructor.call(this, options);
}

SampleGrid.prototype = Object.create(GridComponent.prototype);

SampleGrid.prototype.rendererEmailCol = function (colData, rowData) {
  var email = rowData[colData.key];
  var textTooltip = this.getTooltipAttrText(email, true);
  var html = `<a class="grid-comp-col-text" ${textTooltip} href="#/demo?email=${email}">${email}</a>`;

  return html;
};

SampleGrid.prototype.rendererHiddenCol1Filter = function (colData, $container) {
  $container.innerHTML = 'Custom filter section for hidden column';
};
