import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { MTimeFormatter } from '../../../src/components/cell-formatter';

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

let date = Date.now();

storiesOf('CELLS|mtime-formatter', module)
  .addDecorator(withInfo)
  .add('mtime component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={'Default Date value'}>
        <MTimeFormatter value={date}  />
      </ShowCode>
    </div>
  ), {info})
  
