import FileFormatter from '../../src/FileFormatter';

export default {
  title: 'Formatter/file',
  component: FileFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

const value1_1 = [
  { name: '123.png', type: 'file', url: 'abde' }
];

const value1_2 = [
  { name: '123.png', type: 'file', url: 'abde' },
  { name: 'anc.jpg', type: 'file', url: 'abde' },
  { name: 'nke.text', type: 'file', url: 'abde' }
];

const value2_1 = [
  { name: '123.png', type: 'file', url: 'abde' },
];

const value2_2 = [
  { name: '123.png', type: 'file', url: 'abde' },
  { name: 'anc.jpg', type: 'file', url: 'abde' },
  { name: 'nke.text', type: 'file', url: 'abde' },
  { name: 'nke.md', type: 'file', url: 'abde' }
];

export const Demo1 = {
  args: {
    value: value1_1,
    isSample: true,
  },
};

export const Demo2 = {
  args: {
    value: value1_2,
    isSample: true,
  },
};

export const Demo3 = {
  args: {
    value: value2_1,
  },
};

export const Demo4 = {
  args: {
    value: value2_2,
  },
};
