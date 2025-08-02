import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
import DateEditor from '../../src/DateEditor';

export default {
  title: 'Editor/date',
  component: DateEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    onCommit: (updated) => {action('onCommit')(updated);},
    onClose: fn(),
  },
};

let column1 = {
  key: 'abcd',
  name: 'abcd',
  type: 'date',
  data: {
    format: 'YYYY-MM-DD'
  }
};

let column2 = {
  key: 'abcd',
  name: 'abcd',
  type: 'date',
  data: {
    format: 'YYYY-MM-DD HH:mm'
  }
};

export const Demo1 = {
  args: {
    isReadOnly: false,
    isMobile: false,
    value: '2024-03-05',
    column: column1,
  },
};

export const Demo2 = {
  args: {
    isReadOnly: false,
    isMobile: false,
    value: '2024-03-05 08:00',
    column: column2,
  },
};
