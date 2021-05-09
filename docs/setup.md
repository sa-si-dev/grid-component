## Setup

Import all [downloaded](download.md) `css` and `js` files into your project.

### Create project level component

To add project level common properties and methods, create a grid component by extending grid core component.

```js
class GridComponent extends GridCoreComponent {
  constructor(options) {
    let defaultOptions = {
      exportable: true,
      showSerialNumberCol: true,
    };

    super(Object.assign(defaultOptions, options));
  }
}
```

!> Refer [grid-core.js](https://github.com/{{repo}}/blob/master/src/grid-core.js) file to know all the available methods to override them if required.

### Create sample grid

Create a grid by extending project level grid component.

```js
/** define grid */
class SampleGrid extends GridComponent {
  constructor() {
    let options = {
      ele: '#sample-grid',
      title: sampleGridDetails.title,
      uniqueKey: 'sampleGrid',
      columns: sampleGridDetails.columns,
    };

    super(Object.assign(options));
  }
}

/** initialize grid */
let sampleGrid = new SampleGrid();
```

!> To define list of columns detail, refer [Properties](properties.md?id=column-properties) page.
