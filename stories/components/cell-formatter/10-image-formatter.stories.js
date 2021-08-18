import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { ImageFormatter } from '../../../src/components/cell-formatter';

const info = {
  text: '<h1>API</h1>',
  inline: true,
  source: false,
  propTablesExclude: [ShowCode],
  styles: {
    header: {
      h1: {
        'marginBottom': '8px'
      }
    }
  }
};

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
]

storiesOf('CELLS|image-formatter', module)
  .addDecorator(withInfo)
  .add('image component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={`image-formmater: the demo will show sample image formatter with one image.`}>
        <ImageFormatter value={value1_1}  isSample={true}/>
      </ShowCode>
      <ShowCode title={`image-formmater: the demo will show sample image formatter with more images.`}>
        <ImageFormatter value={value1_2}  isSample={true}/>
      </ShowCode>
      <ShowCode title={`image-formmater: the demo will show complex image formatter with one image.`}>
        <ImageFormatter value={value2_1}  />
      </ShowCode>
      <ShowCode title={`image-formmater: the demo will show complex image formatter with more images.`}>
        <ImageFormatter value={value2_2} />
      </ShowCode>
    </div>
  ), {info})
  
