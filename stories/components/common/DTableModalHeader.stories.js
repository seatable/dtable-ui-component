import React from 'react';
import DTableModalHeader from '../../../src/DTableModalHeader';

const meta = {
  title: 'Common/DTableModalHeader',
  component: DTableModalHeader,
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
  toggle: () => {},
  children: 'DTable Modal Header'
} });
