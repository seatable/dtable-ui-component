import CheckboxFormatter from '../../src/CheckboxFormatter';
import { DEFAULT_CHECKBOX_MARK_STYLE } from '../../src/constants';

export default {
  title: 'Formatter/checkbox',
  component: CheckboxFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    checkboxStyle: DEFAULT_CHECKBOX_MARK_STYLE,
  },
};

export const Demo1 = {
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

export const Demo2 = {
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

export const Demo4 = {
  args: {
    value: true,
    checkboxStyle: { type: 'dot', color: '#ed7109' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo with true value and with dot icon',
      },
    },
  },
};
