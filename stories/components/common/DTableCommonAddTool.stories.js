import React from 'react';
import DTableCommonAddTool from '../../../src/DTableCommonAddTool';

const meta = {
  title: 'Common/DTableCommonAddTool',
  component: DTableCommonAddTool,
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

const Demo = {
  args: {
    value: '',
  },
  parameters: {
    subTitle: ''
  }
};

export const Demo1 = Object.assign({}, Demo, { args: {
  className: '',
  style: { width: '100px' },
  addIconClassName: '',
  footerName: 'Click this',
  // eslint-disable-next-line no-console
  callBack: () => { console.log('click common add tools'); },
  hideIcon: false,
} });
