import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
import MultipleSelectEditor from '../../src/MultipleSelectEditor';

export default {
  title: 'Editor/multiple-select',
  component: MultipleSelectEditor,
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

const value1_1 = [];
const value1_2 = ['1111'];
const column1_1 = {
  key: '0000',
  type: 'multiple-select',
  name: 'state',
  data: {
    options: [
      { id: '1111', name: '未开始', color: 'red' },
      { id: '2222', name: '开始', color: 'blue' },
      { id: '3333', name: '结束', color: 'green' }
    ]
  },
};
const options1 = [
  { id: '1111', name: '未开始', color: 'red' },
  { id: '2222', name: '开始', color: 'blue' },
  { id: '3333', name: '结束', color: 'green' }
];

const value2_1 = [];
const value2_2 = ['1111'];
const column2_1 = {
  key: '256713',
  type: 'multiple-select',
  name: 'state',
  data: {
    options: [
      { id: '256713', name: '待开始', color: '#EED5FF' },
      { name: '进行中', color: '#D7E8FF', textColor: '#212529', id: '839569' },
      { name: '评审', color: '#FFFDCF', id: '954270' },
      { name: '已完成', color: '#DDFFE6', textColor: '#212529', id: '686249' },
      { id: '669117', name: '需要设计稿', color: '#FFFDCF' },
    ]
  },
};
const options2 = [
  { id: '256713', name: '待开始', color: '#EED5FF' },
  { name: '进行中', color: '#D7E8FF', textColor: '#212529', id: '839569' },
  { name: '评审', color: '#FFFDCF', id: '954270' },
  { name: '已完成', color: '#DDFFE6', textColor: '#212529', id: '686249' },
  { id: '669117', name: '需要设计稿', color: '#FFFDCF' },
];

export const Demo1 = {
  args: {
    isReadOnly: false,
    value: value1_1,
    column: column1_1,
    options: options1,
    isMobile: false,
  },
};

export const Demo2 = {
  args: {
    isReadOnly: false,
    value: value2_1,
    column: column2_1,
    options: options2,
    isMobile: false,
  },
};

export const Demo3 = {
  args: {
    isReadOnly: false,
    value: value1_2,
    column: column1_1,
    options: options1,
    isMobile: false,
  },
};

export const Demo4 = {
  args: {
    isReadOnly: false,
    value: value2_2,
    column: column2_1,
    options: options2,
    isMobile: false,
  },
};
