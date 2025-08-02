import DurationFormatter from '../../src/DurationFormatter';

export default {
  title: 'Formatter/duration',
  component: DurationFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    value: 12300,
    format: 'h:mm',
  },
};

export const Demo2 = {
  args: {
    value: 12334,
    format: 'h:mm:ss',
  },
};
