import React from 'react';
import TextFormatter from '../../../src/TextFormatter';

import '../../css/cell-formatter.css';

const meta = {
  title: 'Formatters/text-formatter',
  component: TextFormatter,
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
    value: 'How do you like to go up in a swing, 你喜欢荡一趟秋千',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    value: 'Up in the air so blue? 置身于蓝蓝的晴空吗？',
    containerClassName: 'text-container'
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};
