# dtable-ui-component

[document](https://seatable.github.io/dtable-ui-component/docs/)

## Instructions for using font icons

When using dtable-ui-component component library, you need to import dtable-font font icon.

1. If the dtable-font font icon has been referenced in the application, dtable-ui-component can be used directly
2. If the dtable-font font icon is not referenced in the application, you need to import the corresponding font icon when using dtable-ui-component

```js
  import { CollaboratorEditor } from 'dtable-ui-component';
  import 'dtable-ui-component/assets/dtable-font.css';

  ...
```

## load demand

If you want to use on-demand loading, add the following content to the ` .babelrc` file of your project 

```js
"plugins": [
    ["on-demand-loading", {"library": "dtable-ui-component"}]
 ]
```

Long Text Formatter

If your project only uses a simple long text formatter, you can reference the SimpleLongTextFormatter component.

```js
import { SimpleLongTextFormatter } from 'dtable-ui-component';
```

