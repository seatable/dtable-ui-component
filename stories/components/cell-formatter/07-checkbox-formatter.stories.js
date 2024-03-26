import React from 'react';
import CheckboxFormatter from '../../../src/CheckboxFormatter';

import '../../css/cell-formatter.css';

const meta = {
  title: 'Formatters/checkbox-formatter',
  component: CheckboxFormatter,
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
    value: '',
    containerClassName: 'chackbox-container',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: 'Demo with string'
  }
};

export const Demo2 = {
  args: {
    value: true,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: 'Demo with true value'
  }
};

export const Demo3 = {
  args: {
    value: false,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: 'Demo with false value'
  }
};
