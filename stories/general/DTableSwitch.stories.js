import DTableSwitch from '../../src/DTableSwitch';

export default {
  title: 'General/DTableSwitch',
  component: DTableSwitch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    checked: true,
    onCheckedChange: () => {},
    placeholder: 'Default Switch'
  }
};

export const Demo2 = {
  args: {
    checked: true,
    disabled: true,
    placeholder: 'Disabled Switch'
  }
};

export const Demo3 = {
  args: {
    checked: false,
    onCheckedChange: () => {},
    placeholder: 'Unchecked Switch'
  }
};

export const Demo4 = {
  args: {
    checked: true,
    size: 'lg',
    onCheckedChange: () => {},
    placeholder: 'Large Switch'
  }
};

export const Demo5 = {
  args: {
    checked: true,
    switchPosition: 'left',
    onCheckedChange: () => {},
    placeholder: 'Left Switch'
  }
};

export const Demo6 = {
  args: {
    checked: true,
    onCheckedChange: () => {},
    placeholder: (<div><code>Switch with custom placeholder</code></div>)
  }
};

export const Demo7 = {
  args: {
    checked: true,
    switchClassName: 'dtable-ui-switch-custom',
    onCheckedChange: () => {},
    placeholder: 'Custom className'
  }
};
