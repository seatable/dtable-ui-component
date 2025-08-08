import DateFormatter from '../../src/DateFormatter';

export default {
  title: 'Formatter/date',
  component: DateFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    value: '1997-04-09 12:23',
    format: 'YYYY-MM-DD',
  },
};

export const Demo2 = {
  args: {
    value: '1997-04-09 12:23',
    format: 'YYYY-MM-DD HH:mm',
  },
};

export const Demo3 = {
  args: {
    value: '1997-04-09 12:23',
    format: 'D/M/YYYY',
  },
};

export const Demo4 = {
  args: {
    value: '1997-04-09 12:23',
    format: 'D/M/YYYY HH:mm',
  },
};

export const Demo5 = {
  args: {
    value: '1997-04-09 12:23',
    format: 'M/D/YY',
  },
};

export const Demo6 = {
  args: {
    value: '1997-04-09 12:23',
    format: 'M/D/YYYY HH:mm',
  },
};
