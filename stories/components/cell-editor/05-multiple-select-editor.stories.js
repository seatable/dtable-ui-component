import React from 'react';
import { action } from '@storybook/addon-actions';
import MultipleSelectEditor from '../../../src/MultipleSelectEditor';

const value1_1 = [];
const value1_2 = ['1111'];
const column1_1 = {
  key: '0000',
  type: 'multiple-select',
  name: 'state',
  data: {
    options: [
      {id: '1111', name: '未开始', color: 'red'},
      {id: '2222', name: '开始', color: 'blue'},
      {id: '3333', name: '结束', color: 'green'}
    ]
  },
};

const value2_1 = [];
const value2_2 = ['1111'];
const column2_1 = {
  key: '256713',
  type: 'multiple-select',
  name: 'state',
  data: {
    options: [
      {id: '256713', name: '待开始', color: '#EED5FF'},
      {name: '进行中', color: '#D7E8FF', textColor: '#212529', id: '839569'},
      {name: '评审', color: '#FFFDCF', id: '954270'},
      {name: '已完成', color: '#DDFFE6', textColor: '#212529', id: '686249'},
      {id: '669117', name: '需要设计稿', color: '#FFFDCF'},
    ]
  },
};

const meta = {
  title: 'Editors/multiple-select-editor',
  component: MultipleSelectEditor,
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
    isReadOnly: false,
    value: value1_1,
    column: column1_1,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    isReadOnly: false,
    value: value2_1,
    column: column2_1,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: '',
  }
};

export const Demo3 = {
  args: {
    isReadOnly: false,
    value: value1_2,
    column: column1_1,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: ''
  }
};

export const Demo4 = {
  args: {
    isReadOnly: false,
    value: value2_2,
    column: column2_1,
    onCommit: (updated) => { action('onCommit')(updated); },
  },
  parameters: {
    subTitle: '',
  }
};
