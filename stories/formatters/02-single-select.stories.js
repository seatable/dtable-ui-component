import SingleSelectFormatter from '../../src/SingleSelectFormatter';

export default {
  title: 'Formatter/single-select',
  component: SingleSelectFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

const options = [
  {
    id: '1111',
    name: '未开始',
    color: '#e3f9f6',
  },
  {
    id: '2222',
    name: '进行中',
    color: '#ff7500',
  },
  {
    id: '3333',
    name: '待评审',
    color: '#eaff56',
  },
  {
    id: '4444',
    name: '已评审',
    color: '#faff72',
  },
  {
    id: '5555',
    name: '完成',
    color: '#00e500',
  },
];

export const Demo1 = {
  args: {
    value: '1111',
    options: options,
  },
};

export const Demo2 = {
  args: {
    value: '2222',
    options: options,
  },
};

export const Demo3 = {
  args: {
    value: '3333',
    options: options,
  },
};
