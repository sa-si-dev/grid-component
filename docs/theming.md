## Theming

By default, this plugin has `Light` and `Dark` themes. Project developers could change the colors of these default themes or add a new custom theme by defining CSS variables.

Define CSS variables under the class name `.grid-comp-theme-[THEME_NAME]`

```css
.grid-comp-theme-blue {
  --grid-comp-color-primary-bg: blue;
  ...
}
```

!> Refer [themes.scss](https://github.com/{{repo}}/tree/main/src/sass/partials/themes.scss) for available CSS variables.


### Using theme

You could use the theme by setting `theme` property in any grid class.

```js
class GridComponent extends GridCoreComponent {
  constructor(options) {
    let defaultOptions = {
      theme: 'blue', /** TODO - set theme */
      ...
    };

    super(Object.assign(defaultOptions, options));
  }
}
```

Theme could be changed runtime by calling `setTheme` method

```js
/** to change for a specific grid */
sampleGrid.setTheme('blue');

/** to change for all active grid instances */
GridComponent.setTheme('blue');
```
