import React from 'react';
import DTableEmptyTip from '../../../src/DTableEmptyTip';

const meta = {
  title: 'Common/DTableEmptyTip',
  component: DTableEmptyTip,
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
    src: 'https://dev.seatable.cn/media/img/no-items-tip.png',
    text: 'No content',
  }
});

export const Demo2 = Object.assign({}, Demo, {
  args: {
    src: 'https://dev.seatable.cn/media/img/no-items-tip.png',
    text: 'Internal server error',
    type: 'error',
  }
});

export const Demo3 = Object.assign({}, Demo, {
  args: {
    src: 'https://dev.seatable.cn/media/img/no-items-tip.png',
    children: (
      <>
        <h2>Email sent</h2>
        <span>Check your mail box and change password</span>
        <span>Send an email to SeaTable later</span>
      </>
    ),
  }
});

export const Demo4 = Object.assign({}, Demo, {
  args: {
    src: 'https://dev.seatable.cn/media/img/no-items-tip.png',
    title: 'Email sent',
    text: 'Check your mail box and change password. Send an email to SeaTable later.',
  }
});
