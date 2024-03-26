import React from 'react';
import FileFormatter from '../../../src/FileFormatter';

import '../../css/cell-formatter.css';


const value1_1 = [
  {name: '123.png', type: 'file', url: 'abde'}
];

const value1_2 = [
  {name: '123.png', type: 'file', url: 'abde'},
  {name: 'anc.jpg', type: 'file', url: 'abde'},
  {name: 'nke.text', type: 'file', url: 'abde'}
];

const value2_1 = [
  {name: '123.png', type: 'file', url: 'abde'},
];

const value2_2 = [
  {name: '123.png', type: 'file', url: 'abde'},
  {name: 'anc.jpg', type: 'file', url: 'abde'},
  {name: 'nke.text', type: 'file', url: 'abde'},
  {name: 'nke.md', type: 'file', url: 'abde'}
];

const meta = {
  title: 'Formatters/file-formatter',
  component: FileFormatter,
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
    value: value1_1,
    isSample: true,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    value: value1_2,
    isSample: true,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo3 = {
  args: {
    value: value2_1,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo4 = {
  args: {
    value: value2_2,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};
