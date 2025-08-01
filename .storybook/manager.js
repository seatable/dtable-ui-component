import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'dtable-ui-component',
    brandUrl: 'https://github.com/seatable/dtable-ui-component',
  }),
});
