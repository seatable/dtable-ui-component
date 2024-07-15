import React from 'react';
import DTableColorPicker from '../../../src/DTableColorPicker';

const meta = {
  title: 'Common/DTableColorPicker',
  component: DTableColorPicker,
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
  args: {},
  parameters: {
    subTitle: ''
  }
};

export const Demo1 = Object.assign({}, Demo, {
  args: {
    color: '#111111',
    defaultColors: ['#111111', '#222222', '#eef6f9', '#deffe6', '#aaaaaa', '#bbbbbb', '#eeeeee', '#da32ef'],
    popoverStyle: { left: '30px' },
    onToggle: () => {},
    onSubmit: () => {},
  }
});

export const Demo2 = Object.assign({}, Demo, {
  args: {
    color: '#aaaaaa',
    defaultColors: ['#111111', '#222222', '#eef6f9', '#deffe6', '#aaaaaa', '#bbbbbb'],
    popoverStyle: { right: '10px' },
    onToggle: () => {},
    onSubmit: () => {},
  }
});

export const Demo3 = Object.assign({}, Demo, {
  args: {
    color: '#666666',
    defaultColors: ['#111111', '#222222', '#eef6f9', '#deffe6'],
    popoverStyle: { bottom: '20px' },
    onToggle: () => {},
    onSubmit: () => {},
  }
});
