import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import { NumberFormatter } from '../../../src/components/cell-formatter';

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

storiesOf('CELLS|number-formatter', module)
  .addDecorator(withInfo)
  .add('number component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={'Default Number'}>
        <NumberFormatter value={1234444}  />
      </ShowCode>
      <ShowCode title={'Number with commas'}>
        <NumberFormatter value={1234445.123}  format={'number-with-commas'}/>
      </ShowCode>
      <ShowCode title={'Number with suffix "%"'}>
        <NumberFormatter value={0.12123} format={'percent'}/>
      </ShowCode>
      <ShowCode title={'Number with suffix "¥"'}>
        <NumberFormatter value={10000} format={'yuan'}/>
      </ShowCode>
      <ShowCode title={'Number with suffix "$"'}>
        <NumberFormatter value={999} format={'dollar'}/>
      </ShowCode>
      <ShowCode title={'Number with suffix "€"'}>
        <NumberFormatter value={888} format={'euro'}/>
      </ShowCode>
    </div>
  ), {info})
