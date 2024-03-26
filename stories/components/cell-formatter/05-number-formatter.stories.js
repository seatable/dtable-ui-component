import React from 'react';
import NumberFormatter from '../../../src/NumberFormatter';

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

const meta = {
  title: 'Formatters/number-formatter',
  component: NumberFormatter,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      return (
        <div>
          {context.parameters.title && <h1>{context.parameters.title}</h1>}
          {context.parameters.subTitle && <p className='storybook-sub'>{context.parameters.subTitle}</p>}
          <Story />
        </div>
      );
    }
  ],
  parameters: {
    title: '',
    subTitle: '',
  }
};

export default meta;

export const Demo1 = {
  args: {
    value: 1234444,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: 'Default Number'
  }
};

export const Demo2 = {
  args: {
    value: 1234445.123,
    data: data,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: 'Number with commas'
  }
};

export const Demo3 = {
  args: {
    value: 1234445.123,
    data: data3,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: 'Number with commas'
  }
};

export const Demo4 = {
  args: {
    value: 0.123,
    data: data2,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: 'Number with suffix "%"'
  }
};

export const Demo5 = {
  args: {
    value: 0.123,
    data: data4,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: 'Number with suffix "￥"'
  }
};

