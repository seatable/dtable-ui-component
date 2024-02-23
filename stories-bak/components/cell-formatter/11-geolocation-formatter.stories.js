import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import GeolocationFormatter from '../../../src/GeolocationFormatter';

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

const value1_1 = '';

const value1_2 = {
  province: '河南',
  city: '郑州',
  district: '二七',
  detail: '中原路',
}

storiesOf('CELLS|geolocation-formatter', module)
  .addDecorator(withInfo)
  .add('geolocation component', () => (
    <div>
      <h1>Sample display</h1>
      <ShowCode title={`geolocation-formmater: value is null, there will be return nothing to show.`}>
        <GeolocationFormatter value={value1_1} />
      </ShowCode>
      <ShowCode title={`geolocation-formmater: value is what the geolocation formatter wanted.`}>
        <GeolocationFormatter value={value1_2} />
      </ShowCode>
    </div>
  ), {info})
  
