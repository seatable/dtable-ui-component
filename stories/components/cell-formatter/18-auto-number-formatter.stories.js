import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import AutoNumberFormatter from '../../../src/AutoNumberFormatter';

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

let value1 = '0001'
let value2 = 'test-0001'
let value3 = '20200809-0001'
let value4 = '序号-0001'

storiesOf('CELLS|auto-number-formatter', module)
  .addDecorator(withInfo)
  .add('auto-number component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode>
        <AutoNumberFormatter value={value1} containerClassName={'text-container'} />
      </ShowCode>
      <ShowCode>
        <AutoNumberFormatter value={value2} containerClassName={'text-container'} />
      </ShowCode>
      <ShowCode>
        <AutoNumberFormatter value={value3} />
      </ShowCode>
      <ShowCode>
        <AutoNumberFormatter value={value4} />
      </ShowCode>
    </div>
  ), {info})
