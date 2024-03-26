import React from 'react';
import MultipleSelectFormatter from '../../../src/MultipleSelectFormatter';

let options = [
  {
    id: '1111',
    name: 'urgent',
    color: '#e3f9f6',
  },
  {
    id: '2222',
    name: 'not urgent',
    color: '#ff7500',
  },
  {
    id: '3333',
    name: 'important',
    color: '#eaff56',
  },
  {
    id: '4444',
    name: 'unimportant',
    color: '#faff72',
  },
];

const meta = {
  title: 'Formatters/multiple-select-formatter',
  component: MultipleSelectFormatter,
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

export const Demo1 = {
  args: {
    value: ['1111', '3333'],
    options: options,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    value: ['1111', '4444'],
    options: options,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};
