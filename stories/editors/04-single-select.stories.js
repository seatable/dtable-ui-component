import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
import SingleSelectEditor from '../../src/SingleSelectEditor';

export default {
  title: 'Editor/single-select',
  component: SingleSelectEditor,
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

const value1_1 = '';
const value1_2 = '66905';
const column1_1 = {
  key: '0000',
  type: 'single-select',
  name: 'state',
  data: {
    options: [
      {
        'name': '低',
        'color': '#D8FAFF',
        'textColor': '#212529',
        'borderColor': '#B4E4E9',
        'id': '66905'
      },
      {
        'name': '中',
        'color': '#46A1FD',
        'textColor': '#FFFFFF',
        'borderColor': '#3C8FE4',
        'id': '193'
      },
      {
        'name': '高',
        'color': '#DC82D2',
        'textColor': '#FFFFFF',
        'borderColor': '#D166C5',
        'id': '20948'
      }
    ]
  },
};

const value2_1 = '';
const value2_2 = '893289';
const column2_1 = {
  key: '256713',
  type: 'single-select',
  name: 'state',
  data: {
    options: [
      {
        'name': '小',
        'color': '#D8FAFF',
        'textColor': '#212529',
        'borderColor': '#B4E4E9',
        'id': '893289'
      },
      {
        'name': '中',
        'color': '#D7E8FF',
        'textColor': '#212529',
        'borderColor': '#BAD1E9',
        'id': '138031'
      },
      {
        'name': '大',
        'color': '#B7CEF9',
        'textColor': '#212529',
        'id': '853367',
        'borderColor': '#96B2E1'
      }
    ]
  },
};

const options = [
  {
    'name': '低',
    'color': '#D8FAFF',
    'textColor': '#212529',
    'borderColor': '#B4E4E9',
    'id': '66905'
  },
  {
    'name': '中',
    'color': '#46A1FD',
    'textColor': '#FFFFFF',
    'borderColor': '#3C8FE4',
    'id': '193'
  },
  {
    'name': '高',
    'color': '#DC82D2',
    'textColor': '#FFFFFF',
    'borderColor': '#D166C5',
    'id': '20948'
  }
];

export const Demo1 = {
  args: {
    options,
    isReadOnly: false,
    value: value1_1,
    column: column1_1,
    isMobile: false,
  },
};

export const Demo2 = {
  args: {
    options,
    isReadOnly: false,
    value: value2_1,
    column: column2_1,
    isMobile: false,
  },
};

export const Demo3 = {
  args: {
    options,
    isReadOnly: false,
    value: value1_2,
    column: column1_1,
    isMobile: false,
  },
};

export const Demo4 = {
  args: {
    options,
    isReadOnly: false,
    value: value2_2,
    column: column2_1,
    isMobile: false,
  },
};
