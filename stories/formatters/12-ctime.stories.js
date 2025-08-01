import CTimeFormatter from '../../src/CTimeFormatter';

export default {
  title: 'Formatter/ctime',
  component: CTimeFormatter,
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
