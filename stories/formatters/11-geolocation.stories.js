import GeolocationFormatter from '../../src/GeolocationFormatter';

export default {
  title: 'Formatter/geolocation',
  component: GeolocationFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

const value1_1 = '';

const value1_2 = {
  province: '河南',
  city: '郑州',
  district: '二七',
  detail: '中原路',
};

export const Demo1 = {
  args: {
    value: value1_1,
  },
};

export const Demo2 = {
  args: {
    value: value1_2,
  },
};
