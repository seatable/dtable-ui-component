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

const data = {
  decimal: "dot",
  enable_precision: true,
  format: "number",
  precision: 1,
  thousands: "no",
}

const data2 = {
  decimal: "dot",
  enable_precision: true,
  format: "percent",
  precision: 0,
  thousands: "no"
}

const data3 = {
  decimal: "dot",
  enable_precision: false,
  format: "number",
  precision: 2,
  thousands: "no"
}

const data4 = {
  decimal: "dot",
  enable_precision: false,
  format: "yuan",
  precision: 2,
  thousands: "comma"
}

storiesOf('CELLS|number-formatter', module)
  .addDecorator(withInfo)
  .add('number component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={'Default Number'}>
        <NumberFormatter value={1234444}  />
      </ShowCode>
      <ShowCode title={'Number with commas'}>
        <NumberFormatter value={1234445.123} data={data}/>
      </ShowCode>
      <ShowCode title={'Number with commas'}>
        <NumberFormatter value={1234445.123} data={data3}/>
      </ShowCode>
      <ShowCode title={'Number with suffix "%"'}>
        <NumberFormatter value={0.12123} data={data2} />
      </ShowCode>
      <ShowCode title={'Number with suffix "¥"'}>
        <NumberFormatter value={10000} data={data4}/>
      </ShowCode>
      <ShowCode title={'Number with suffix "$"'}>
        <NumberFormatter value={999} format={'dollar'}/>
      </ShowCode>
      <ShowCode title={'Number with suffix "€"'}>
        <NumberFormatter value={888} format={'euro'}/>
      </ShowCode>
    </div>
  ), {info})
