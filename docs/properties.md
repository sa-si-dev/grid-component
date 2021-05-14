# Properties

<div class="docs-table-container">

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| ele | String \| Element | | Parent element to render Grid<br/>String - #sample-grid <br/>Element - document.querySelector('#sample-grid') |
| title | String | | Title to show in the header |
| uniqueKey | String | | Unique key to save grid settings in the localstorage |
| apiUrl | String | | API url to use to get rows from server |
| heightOffset | String | | Space to leave on top and bottom of the grid |
| disableLocalstorage | Boolean | false | Disabling localstorage to save grid settings |
| scrollableContent | Boolean | true | Make header and footer fixed by making rows scrollable |
| rowsFromServer | Boolean | true | Get grid rows from server through api |
| resizable | Boolean | true | Allow to resize all columns |
| sortable | Boolean | false | Allow to sort all columns |
| exportable | Boolean | false | To show export button |
| hideHeader | Boolean | false | Hide header section of component |
| showFilters | Boolean | false | Show filters button to open filters |
| showSettings | Boolean | false | Show settings button to customize columns |
| showSerialNumberCol | Boolean | false | Show serial number column |
| theme | String | light | Default available themes are light and dark. But you could define custom themes and use here. ([more details](theming.md)) |
| language | String | default | Language name to get i18n text ([more details](internationalization.md)) |
| tooltipFontSize | String | 14px | Font size for tooltip |
| tooltipAlignment | String | center | CSS Text alignment for tooltip |
| tooltipEnterDelay | String | 300 | Delay time before showing tooltip (in milliseconds) |
| perPageOptions | Array\<Number\> | [25, 50, 100] | List of options for per page dropdown |
| rowsFromServer | Boolean | true | Get rows from server through API call |
| rows | Array\<Object\> | | List of rows details. It would be used to render static rows instead of getting from server. |
| columns | Array\<Object\> | | List of columns details. Refer [Column Properties](#column-properties) for more details. |
| filtersValue | Array\<Object\> | | Default filters value to show as filters tags and prefill filters form on render. Refer [Filter Value Properties](#filter-value-properties) for more details. |

</div>

<br>

# Column Properties

<div class="docs-table-container">

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| id | String | | Unique column ID |
| name | String | | Column header text |
| key | String | | Property name to get column value from row details |
| width | String | | Width of the column (in px) |
| align | String | left | CSS text align value (left, right, center) |
| renderer | Function | | Callback method name to render column value |
| sticky | Boolean | false | Make the column fixed on scroll horizontally |
| resizable | Boolean | | Allow to resize width of the column |
| sortable | Boolean | | Make the column sortable |
| hidden | Boolean | | Hide the column |
| alwaysShow | Boolean | false | Not allowed to hide the column in the settings |
| filter | Object | | Filter details of the column. Refer [Column Filter Properties](#column-filter-properties) for more details |

</div>

<br>

# Column Filter Properties

<div class="docs-table-container">

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| type | String | text | Type of filter field to render. (Available types - text, number, select) |
| key | String | | Property name to set filter value. If not given key from column details would be used. |
| criteria | Array\<String\> | | List of criteria to show as dropdown options |
| renderer | Function | | Callback method name to render filter section |
| multiple | Boolean | false | Allow multiple values in filter field type select |
| allowDecimal | Boolean | false | Allow decimal number in filter field type number |

</div>

<br>

# Filter Value Properties

<div class="docs-table-container">

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| id | String | | Same as columns[].id |
| key | String | | Same as filter.key or columns[].key |
| criteria | String | | Criteria to apply filter value |
| value | String \| Array | | Value to filter rows |

</div>