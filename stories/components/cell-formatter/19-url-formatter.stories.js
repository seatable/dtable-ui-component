import React from 'react';
import UrlFormatter from '../../../src/UrlFormatter';

import '../../css/cell-formatter.css';

const meta = {
  title: 'Formatters/url-formatter',
  component: UrlFormatter,
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

let value1 = 'seatable.cn';
let value2 = 'https://seatable.cn';
let value3 = 'http://seatable.cn';
let value4 = '192.168.1.1';

export const Demo1 = {
  args: {
    value: value1,
    containerClassName: 'text-container',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    value: value2,
    containerClassName: 'text-container',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo3 = {
  args: {
    value: value3,
    containerClassName: 'text-container',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo4 = {
  args: {
    value: value4,
    containerClassName: 'text-container',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};
