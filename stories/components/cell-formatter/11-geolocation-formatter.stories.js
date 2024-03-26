import React from 'react';
import GeolocationFormatter from '../../../src/GeolocationFormatter';

import '../../css/cell-formatter.css';

const value1_1 = '';

const value1_2 = {
  province: '河南',
  city: '郑州',
  district: '二七',
  detail: '中原路',
};

const meta = {
  title: 'Formatters/geolocation-formatter',
  component: GeolocationFormatter,
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
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    value: value1_2,
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};
