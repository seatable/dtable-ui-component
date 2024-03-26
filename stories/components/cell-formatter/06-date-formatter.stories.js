import React from 'react';
import DateFormatter from '../../../src/DateFormatter';
import { DATE_TYPES } from '../../../src/constants';

import '../../css/cell-formatter.css';

const meta = {
  title: 'Formatters/date-formatter',
  component: DateFormatter,
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
    value: '1997-04-09 12:23',
    format: DATE_TYPES['D/M/YYYY']
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    value: '1997-04-09 12:23',
    format: DATE_TYPES['D/M/YYYY HH:mm']
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo3 = {
  args: {
    value: '1997-04-09 12:23',
    format: DATE_TYPES['M/D/YYYY']
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo4 = {
  args: {
    value: '1997-04-09 12:23',
    format: DATE_TYPES['M/D/YYYY HH:mm']
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo5 = {
  args: {
    value: '1997-04-09 12:23',
    format: DATE_TYPES['YYYY-MM-DD HH:mm']
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

