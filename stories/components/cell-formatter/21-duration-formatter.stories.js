import React from 'react';
import DurationFormatter from '../../../src/DurationFormatter';

import '../../css/cell-formatter.css';

const meta = {
  title: 'Formatters/duration-formatter',
  component: DurationFormatter,
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

let value1 = 12300;
let value2 = 12334;

export default meta;

export const Demo1 = {
  args: {
    value: value1,
    format: 'h:mm',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    value: value2,
    format: 'h:mm:ss',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};
