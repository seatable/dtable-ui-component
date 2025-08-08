import { fn } from 'storybook/test';
import CheckboxEditor from '../../src/CheckboxEditor';

export default {
  title: 'Editor/checkbox',
  component: CheckboxEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onCommit: fn() },
};

const value1_1 = false;
const column1_1 = {
  key: '0000',
  type: 'checkbox',
  name: 'Name',
  data: null,
};

const value1_2 = true;
const column1_2 = {
  key: '0000',
  type: 'checkbox',
  name: 'Name',
  data: null
};

export const Demo1 = {
  args: {
    isReadOnly: false,
    value: value1_1,
    column: column1_1,
  },
};

export const Demo2 = {
  args: {
    isReadOnly: true,
    value: value1_2,
    column: column1_2,
  },
};
