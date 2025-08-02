import NumberFormatter from '../../src/NumberFormatter';

export default {
  title: 'Formatter/number',
  component: NumberFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

const data = {
  decimal: 'dot',
  enable_precision: true,
  format: 'number',
  precision: 1,
  thousands: 'no',
};

const data2 = {
  decimal: 'dot',
  enable_precision: true,
  format: 'percent',
  precision: 0,
  thousands: 'no'
};

const data3 = {
  decimal: 'dot',
  enable_precision: false,
  format: 'number',
  precision: 2,
  thousands: 'no'
};

const data4 = {
  decimal: 'dot',
  enable_precision: false,
  format: 'yuan',
  precision: 2,
  thousands: 'comma'
};

export const Demo1 = {
  args: {
    value: 1234444,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Number',
      },
    },
  },
};

export const Demo2 = {
  args: {
    value: 1234445.123,
    data: data,
  },
  parameters: {
    docs: {
      description: {
        story: 'Number with commas',
      },
    },
  },
};

export const Demo3 = {
  args: {
    value: 1234445.123,
    data: data3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Number with commas',
      },
    },
  },
};

export const Demo4 = {
  args: {
    value: 0.123,
    data: data2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Number with suffix "%"',
      },
    },
  },
};

export const Demo5 = {
  args: {
    value: 0.123,
    data: data4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Number with suffix "￥"',
      },
    },
  },
};
