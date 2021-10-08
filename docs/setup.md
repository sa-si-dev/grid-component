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

!> Refer [grid-core.js](https://github.com/{{repo}}/blob/main/src/grid-core.js) file to know all the available methods to override them if required.

### Create sample grid

Create a grid by extending project level grid component.

```js
/** define grid */
class SampleGrid extends GridComponent {
  constructor() {
    let options = {
      ele: '#sample-grid',
      title: 'This is a sample grid',
      uniqueKey: 'sampleGrid',
      columns: [
        {
          id: 'firstName',
          name: 'First Name',
          key: 'first_name',
        },
        {
          id: 'lastName',
          name: 'Last Name',
          key: 'last_name',
        },
        {
          id: 'country',
          name: 'Country',
          key: 'country',
        },
      ],
    };

    super(Object.assign(options));
  }

  /** custom column render metod. it needs to declared in column details (columns[].renderer) to use it */
  rendererEmailCol(colData, rowData) {
    let email = rowData[colData.key];
    let textTooltip = this.getTooltipAttrText(email, true);
    let html = `<a class="grid-comp-col-text" ${textTooltip} href="#/demo?email=${email}">${email}</a>`;

    return html;
  }
}

/** initialize grid */
let sampleGrid = new SampleGrid();
```

```html
<!-- dom element to render the grid -->
<div id="sample-grid"></div>
```

!> To define list of columns detail, refer [Properties](properties.md?id=column-properties) page.
