## Internationalization

By default, all the text in this plugin would be in the `English` language only. Project developers could change all the default texts or use completely different languages.

To override or define a new language, set properties in the `JavaScript` global object `gridCompI18n`.

```js
/** to override default text */
gridCompI18n.default['first.page'] = 'Go to start';

/** or */
Object.assign(gridCompI18n.default, {
  'last.page': 'Go to end',
  ...
});

/** to define a new language */
gridCompI18n.tamil = {
  'first.page': 'முதல் பக்கம்',
  'last.page': 'கடைசி பக்கம்',
  ...
};
```

!> Refer [i18n.js](https://github.com/{{repo}}/blob/main/src/i18n.js) for all available texts

### Set language

```js
class GridComponent extends GridCoreComponent {
  constructor(options) {
    let defaultOptions = {
      language: 'tamil', /** TODO - set language */
      ...
    };

    super(Object.assign(defaultOptions, options));
  }
}
```
