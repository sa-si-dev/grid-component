### API Integration

!> Project developer has to define anyMehodToGetDataFromServer method to make API call

```js
/** define all API related methods in project level component */
class GridComponent extends GridCoreComponent {
  getRows() {
    super.getRows();

    let reqData = this.getReqData();

    anyMehodToGetDataFromServer(reqData).then((res) => {
      this.afterGetRows(res.rows, res.meta);
    });
  }

  getGrandTotal() {
    super.getGrandTotal();

    let reqData = this.getReqDataForGrandTotal();

    anyMehodToGetDataFromServer(reqData).then((res) => {
      this.afterGetGrandTotal(res.grandTotal);
    });
  }

  exportRows() {
    super.exportRows();

    let reqData = this.getReqData();
    reqData.type = 'export';

    anyMehodToGetDataFromServer(reqData);
  }
}

/** define apiUrl in the specific grid */
class SampleGrid extends GridComponent {
  constructor() {
    let options = {
      ...
      apiUrl: 'api/sample-grid',
    };

    super(options);
  }
}
```
