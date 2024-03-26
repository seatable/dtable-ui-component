import React from 'react';
import AutoNumberFormatter from '../../../src/AutoNumberFormatter';

import '../../css/cell-formatter.css';

let value1 = '0001';
let value2 = 'test-0001';
let value3 = '20200809-0001';
let value4 = '序号-0001';

const meta = {
  title: 'Formatters/auto-number-formatter',
  component: AutoNumberFormatter,
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
    value: value1,
    containerClassName: 'text-container'
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    value: value2,
    containerClassName: 'text-container'
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo3 = {
  args: {
    value: value3,
    containerClassName: 'text-container'
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo4 = {
  args: {
    value: value4,
    containerClassName: 'text-container'
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};
