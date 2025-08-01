import DTableEmptyTip from '../../src/DTableEmptyTip';

export default {
  title: 'General/DTableEmptyTip',
  component: DTableEmptyTip,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

export const Demo1 = {
  args: {
    src: 'https://dev.seatable.cn/media/img/no-items-tip.png',
    text: 'No content',
  }
};

export const Demo2 = {
  args: {
    src: 'https://dev.seatable.cn/media/img/no-items-tip.png',
    text: 'Internal server error',
    type: 'error',
  }
};

export const Demo3 = {
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
};

export const Demo4 = {
  args: {
    src: 'https://dev.seatable.cn/media/img/no-items-tip.png',
    title: 'Email sent',
    text: 'Check your mail box and change password. Send an email to SeaTable later.',
  }
};
