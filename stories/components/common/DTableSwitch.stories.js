import React from 'react';
import DtableSwitch from '../../../src/DTableSwitch';

const meta = {
  title: 'Common/DtableSwitch',
  component: DtableSwitch,
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

export const Demo1 = Object.assign({}, Demo, { args: { isChecked: true, onCheckedChange: () => {}, placeholder: 'Default Switch' } });

export const Demo2 = Object.assign({}, Demo, { args: { isChecked: true, disabled: true, placeholder: 'Disabled Switch' } });

export const Demo3 = Object.assign({}, Demo, { args: { isChecked: false, onCheckedChange: () => {}, placeholder: 'Unchecked Switch' } });

