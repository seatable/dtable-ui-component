import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import DurationFormatter from '../../../src/DurationFormatter';

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

let value1 = 12300;
let value2 = 12334
let value3 = 660;


storiesOf('CELLS|duration-formatter', module)
  .addDecorator(withInfo)
  .add('duration component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode>
        <DurationFormatter value={value1} format='h:mm' />
      </ShowCode>
      <ShowCode>
        <DurationFormatter value={value2} format='h:mm:ss' />
      </ShowCode>
      <ShowCode>
        <DurationFormatter value={value3} format='h:mm:ss' />
      </ShowCode>
    </div>
  ), {info})
