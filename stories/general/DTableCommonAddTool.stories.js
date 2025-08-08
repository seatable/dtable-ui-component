import { fn } from 'storybook/test';
import DTableCommonAddTool from '../../src/DTableCommonAddTool';

export default {
  title: 'General/DTableCommonAddTool',
  component: DTableCommonAddTool,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { callBack: fn() },
};

export const Demo1 = {
  args: {
    className: '',
    style: { width: '100px' },
    addIconClassName: '',
    footerName: 'Click this',
    hideIcon: false,
  }
};
