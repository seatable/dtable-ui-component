import LongTextFormatter from '../../src/LongTextFormatter';

export default {
  title: 'Formatter/long-text',
  component: LongTextFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

const value1 = {
  links: [],
  images: [],
  text: 'To see a world in a grain of sand, And a heaven in a wild flower, Hold infinity in the palm of your hand,And eternity in an hour.',
  preview: 'To see a world in a grain of sand, And a...',
};

const value2 = {
  links: [
    'http://baidu.com',
  ],
  images: [],
  text: 'To see a world in a grain of sand, And a heaven in a wild flower, Hold infinity in the palm of your hand,And eternity in an hour.',
  preview: 'To see a world in a grain of sand, And a...',
};

const value3 = {
  links: [],
  images: [
    'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg'
  ],
  text: 'To see a world in a grain of sand, And a heaven in a wild flower, Hold infinity in the palm of your hand,And eternity in an hour.',
  preview: 'To see a world in a grain of sand, And a...',
};

const value4 = {
  links: [
    'http://baidu.com'
  ],
  images: [
    'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg'
  ],
  text: 'To see a world in a grain of sand, And a heaven in a wild flower, Hold infinity in the palm of your hand,And eternity in an hour.',
  preview: 'To see a world in a grain of sand, And a...',
};

const value5 = {
  links: [
    'http://baidu.com',
    'http://127.0.0.1',
    'http://bingying.com'
  ],
  images: [
    'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg',
    'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg',
    'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg',
    'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg',
    'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg',
  ],
  text: 'To see a world in a grain of sand, And a heaven in a wild flower, Hold infinity in the palm of your hand,And eternity in an hour.',
  preview: 'To see a world in a grain of sand, And a...',
};

export const Demo1 = {
  args: {
    value: value1,
  },
};

export const Demo2 = {
  args: {
    value: value2,
  },
};

export const Demo3 = {
  args: {
    value: value3,
  },
};

export const Demo4 = {
  args: {
    value: value4,
  },
};

export const Demo5 = {
  args: {
    value: value5,
  },
};
