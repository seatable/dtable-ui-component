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

let value1 = 'example@163.com'
let value2 = 'example@qq.com'
let value3 = 'example@gmail.com'


storiesOf('CELLS|email-formatter', module)
  .addDecorator(withInfo)
  .add('email component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode>
        <UrlFormatter value={value1} />
      </ShowCode>
      <ShowCode>
        <UrlFormatter value={value2} />
      </ShowCode>
      <ShowCode>
        <UrlFormatter value={value3} />
      </ShowCode>
    </div>
  ), {info})
