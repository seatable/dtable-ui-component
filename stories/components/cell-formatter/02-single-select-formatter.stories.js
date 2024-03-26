import React from 'react';
import SingleSelectFormatter from '../../../src/SingleSelectFormatter';

let options = [
  {
    id: '1111',
    name: '未开始',
    color: '#e3f9f6',
  },
  {
    id: '2222',
    name: '进行中',
    color: '#ff7500',
  },
  {
    id: '3333',
    name: '待评审',
    color: '#eaff56',
  },
  {
    id: '4444',
    name: '已评审',
    color: '#faff72',
  },
  {
    id: '5555',
    name: '完成',
    color: '#00e500',
  },
];

const meta = {
  title: 'Formatters/single-select-formatter',
  component: SingleSelectFormatter,
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
    value: '1111',
    options: options,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    value: '2222',
    options: options,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo3 = {
  args: {
    value: '3333',
    options: options,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};
