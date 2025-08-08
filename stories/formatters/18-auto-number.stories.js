import AutoNumberFormatter from '../../src/AutoNumberFormatter';

export default {
  title: 'Formatter/auto-number',
  component: AutoNumberFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    value: '0001',
  },
};

export const Demo2 = {
  args: {
    value: 'test-0001',
  },
};

export const Demo3 = {
  args: {
    value: '20200809-0001',
  },
};

export const Demo4 = {
  args: {
    value: '序号-0001',
  },
};
