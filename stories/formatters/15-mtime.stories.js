import MTimeFormatter from '../../src/MTimeFormatter';

export default {
  title: 'Formatter/mtime',
  component: MTimeFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    value: Date.now(),
  },
};
