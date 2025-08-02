import CheckboxFormatter from '../../src/CheckboxFormatter';

export default {
  title: 'Formatter/checkbox',
  component: CheckboxFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    value: '',
    containerClassName: 'checkbox-container',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo with empty string',
      },
    },
  },
};

export const Demo2 = {
  args: {
    value: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo with true value',
      },
    },
  },
};

export const Demo3 = {
  args: {
    value: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo with false value',
      },
    },
  },
};
