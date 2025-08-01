import UrlFormatter from '../../src/UrlFormatter';

export default {
  title: 'Formatter/url',
  component: UrlFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    value: 'seatable.cn',
  },
};

export const Demo2 = {
  args: {
    value: 'https://seatable.cn',
  },
};

export const Demo3 = {
  args: {
    value: 'http://seatable.cn',
  },
};

export const Demo4 = {
  args: {
    value: '192.168.1.1',
  },
};
