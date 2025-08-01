import EmailFormatter from '../../src/EmailFormatter';

export default {
  title: 'Formatter/email',
  component: EmailFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    value: 'example@163.com',
  },
};

export const Demo2 = {
  args: {
    value: 'example@qq.com',
  },
};

export const Demo3 = {
  args: {
    value: 'example@gmail.com',
  },
};
