import React from 'react';
import DTableSwitch from '../../../src/DTableSwitch';

const meta = {
  title: 'Common/DTableSwitch',
  component: DTableSwitch,
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

const Demo = {
  args: {
    value: '',
  },
  parameters: {
    subTitle: ''
  }
};

export const Demo1 = Object.assign({}, Demo, { args: {
  checked: true,
  onCheckedChange: () => {},
  placeholder: 'Default Switch'
} });

export const Demo2 = Object.assign({}, Demo, { args: {
  checked: true,
  disabled: true,
  placeholder: 'Disabled Switch'
} });

export const Demo3 = Object.assign({}, Demo, { args: {
  checked: false,
  onCheckedChange: () => {},
  placeholder: 'Unchecked Switch'
} });

export const Demo4 = Object.assign({}, Demo, { args: {
  checked: true,
  size: 'lg',
  onCheckedChange: () => {},
  placeholder: 'Large Switch'
} });

export const Demo5 = Object.assign({}, Demo, { args: {
  checked: true,
  switchPosition: 'left',
  onCheckedChange: () => {},
  placeholder: 'Left Switch'
} });

export const Demo6 = Object.assign({}, Demo, { args: {
  checked: true,
  onCheckedChange: () => {},
  placeholder: (<div><code>Switch with custom placeholder</code></div>)
} });

export const Demo7 = Object.assign({}, Demo, { args: {
  checked: true,
  switchClassName: 'dtable-ui-switch-custom',
  onCheckedChange: () => {},
  placeholder: 'Custom className'
} });
