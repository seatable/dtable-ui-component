import TextFormatter from '../../src/TextFormatter';

import '../css/text-formatter.css';

export default {
  title: 'Formatter/text',
  component: TextFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    value: 'How do you like to go up in a swing, 你喜欢荡一趟秋千',
  },
};

export const Demo2 = {
  args: {
    value: 'Up in the air so blue? 置身于蓝蓝的晴空吗？',
    containerClassName: 'text-container'
  },
};
