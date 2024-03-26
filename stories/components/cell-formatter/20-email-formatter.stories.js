import React from 'react';
import EmailFormatter from '../../../src/EmailFormatter';

import '../../css/cell-formatter.css';

const meta = {
  title: 'Formatters/email-formatter',
  component: EmailFormatter,
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

let value1 = 'example@163.com';
let value2 = 'example@qq.com';
let value3 = 'example@gmail.com';

export default meta;

const Demo = {
  args: {
    value: '',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo1 = Object.assign({}, Demo, { args: { value: value1 } });
export const Demo2 = Object.assign({}, Demo, { args: { value: value2 } });
export const Demo3 = Object.assign({}, Demo, { args: { value: value3 } });
