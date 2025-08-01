import DTableModalHeader from '../../src/DTableModalHeader';

export default {
  title: 'General/DTableModalHeader',
  component: DTableModalHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    toggle: () => {},
    children: 'DTable Modal Header'
  }
};
