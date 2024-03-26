import React from 'react';
import ImageFormatter from '../../../src/ImageFormatter';

import '../../css/cell-formatter.css';


const value1_1 = [
  'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3228862102,3652591076&fm=26&gp=0.jpg',
];

const value1_2 = [
  'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3228862102,3652591076&fm=26&gp=0.jpg',
  'http://tbn.tukuchina.cn/images/bd1200/b1/bd/229548896.jpg?x-oss-process=style/m800',
  'https://588ku.com/ycwordart/10538694.html',
];

const value2_1 = [
  'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3228862102,3652591076&fm=26&gp=0.jpg',
];


const value2_2 = [
  'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3228862102,3652591076&fm=26&gp=0.jpg',
  'http://tbn.tukuchina.cn/images/bd1200/b1/bd/229548896.jpg?x-oss-process=style/m800',
  'http://img0.imgtn.bdimg.com/it/u=2410579766,1262014624&fm=11&gp=0.jpg',
  'http://img4.imgtn.bdimg.com/it/u=3102984604,3811343374&fm=26&gp=0.jpg',
];

const meta = {
  title: 'Formatters/image-formatter',
  component: ImageFormatter,
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
    isSample: true
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo2 = {
  args: {
    value: value1_2,
    isSample: true
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo3 = {
  args: {
    value: value2_1,
    isSample: true
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};

export const Demo4 = {
  args: {
    value: value2_2,
    isSample: true
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: ''
  }
};
