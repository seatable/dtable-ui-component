import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import EmailFormatter from '../../../src/EmailFormatter';

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
        <EmailFormatter value={value1} />
      </ShowCode>
      <ShowCode>
        <EmailFormatter value={value2} />
      </ShowCode>
      <ShowCode>
        <EmailFormatter value={value3} />
      </ShowCode>
    </div>
  ), {info})
