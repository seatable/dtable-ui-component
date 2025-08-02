import { fn } from 'storybook/test';
import TextEditor from '../../src/TextEditor';

export default {
  title: 'Editor/text',
  component: TextEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onCommit: fn() },
};

const value1_1 = 'Hello SeaTable';

const column1_1 = {
  key: '0000',
  name: 'Read-write text editor',
};

const column1_2 = {
  key: '0000',
  name: 'Read-only text editor',
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
    value: value1_1,
    column: column1_2,
  },
};
