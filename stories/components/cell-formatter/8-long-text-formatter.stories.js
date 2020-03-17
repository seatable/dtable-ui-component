import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { LongTextFormatter } from '../../../src/components/cell-formatter';

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


storiesOf('CELLS|long-text-formatter', module)
  .addDecorator(withInfo)
  .add('long-text component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={`long-text: no links and images in the value.`}>
        <LongTextFormatter value={value1}  />
      </ShowCode>
      <ShowCode title={`long-text: no images in the value.`}>
        <LongTextFormatter value={value2}  />
      </ShowCode>
      <ShowCode title={`long-text: no links in the value.`}>
        <LongTextFormatter value={value3}  />
      </ShowCode>
      <ShowCode title={`long-text: there are one link and one image in the value.`}>
        <LongTextFormatter value={value4}  />
      </ShowCode>
      <ShowCode title={`long-text: there are many links and many images in the value.`}>
        <LongTextFormatter value={value5}  />
      </ShowCode>
    </div>
  ), {info})
  