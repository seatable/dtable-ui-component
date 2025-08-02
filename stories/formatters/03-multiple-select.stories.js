import MultipleSelectFormatter from '../../src/MultipleSelectFormatter';

export default {
  title: 'Formatter/multiple-select',
  component: MultipleSelectFormatter,
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
    name: 'urgent',
    color: '#e3f9f6',
  },
  {
    id: '2222',
    name: 'not urgent',
    color: '#ff7500',
  },
  {
    id: '3333',
    name: 'important',
    color: '#eaff56',
  },
  {
    id: '4444',
    name: 'unimportant',
    color: '#faff72',
  },
];

export const Demo1 = {
  args: {
    value: ['1111', '3333'],
    options: options,
  },
};

export const Demo2 = {
  args: {
    value: ['1111', '4444'],
    options: options,
  },
};
