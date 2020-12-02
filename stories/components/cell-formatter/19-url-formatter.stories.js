import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { UrlFormatter } from '../../../src/components/cell-formatter';

import '../../css/cell-formatter.css';

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

let value1 = 'seatable.cn'
let value2 = 'https://seatable.cn'
let value3 = 'http://seatable.cn'
let value4 = '192.168.1.1'

storiesOf('CELLS|url-formatter', module)
  .addDecorator(withInfo)
  .add('url component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode>
        <UrlFormatter value={value1} containerClassName={'text-container'} />
      </ShowCode>
      <ShowCode>
        <UrlFormatter value={value2} containerClassName={'text-container'} />
      </ShowCode>
      <ShowCode>
        <UrlFormatter value={value3} />
      </ShowCode>
      <ShowCode>
        <UrlFormatter value={value4} />
      </ShowCode>
    </div>
  ), {info})
